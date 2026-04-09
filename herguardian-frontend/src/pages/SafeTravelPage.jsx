import { useEffect, useMemo, useState } from "react";
import api from "../api";
import TravelMap from "../components/TravelMap";

const DESTINATION_LOOKUP = {
  gachibowli: {
    label: "Gachibowli",
    latitude: 17.4401,
    longitude: 78.3489,
  },
  "hitech city": {
    label: "Hitech City",
    latitude: 17.4504,
    longitude: 78.3817,
  },
  secunderabad: {
    label: "Secunderabad",
    latitude: 17.4399,
    longitude: 78.4983,
  },
  ameerpet: {
    label: "Ameerpet",
    latitude: 17.4374,
    longitude: 78.4482,
  },
  kukatpally: {
    label: "Kukatpally",
    latitude: 17.4948,
    longitude: 78.3996,
  },
  madhapur: {
    label: "Madhapur",
    latitude: 17.4483,
    longitude: 78.3915,
  },
};

export default function SafeTravelPage() {
  const currentUser = JSON.parse(localStorage.getItem("herguardian_user") || "null");

  const [formData, setFormData] = useState({
    source: "Current Location",
    destination: "",
    source_latitude: "",
    source_longitude: "",
    destination_latitude: "",
    destination_longitude: "",
    deviation_threshold_m: 120,
  });

  const [travelData, setTravelData] = useState(null);

  const [liveLocation, setLiveLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [destinationError, setDestinationError] = useState("");

  const hasActiveTravel =
    Boolean(travelData?.id) && travelData?.status !== "completed";

  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setStatusMessage("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));

        setFormData((prev) => ({
          ...prev,
          source: "Current Location",
          source_latitude: latitude,
          source_longitude: longitude,
        }));

        setLiveLocation({
          latitude,
          longitude,
        });

        setStatusMessage("Current location detected successfully.");
        setLocationLoading(false);
      },
      () => {
        setStatusMessage("Location access denied or unavailable.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleDestinationInput = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      destination: value,
      destination_latitude: "",
      destination_longitude: "",
    }));

    setDestinationError("");
  };

  const resolveDestination = () => {
    const key = formData.destination.trim().toLowerCase();

    if (!key) {
      setDestinationError("Please enter a destination.");
      return false;
    }

    const matched = DESTINATION_LOOKUP[key];

    if (!matched) {
      setDestinationError(
        "Destination not recognized yet. Try: Gachibowli, Hitech City, Secunderabad, Ameerpet, Kukatpally, or Madhapur."
      );
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      destination: matched.label,
      destination_latitude: matched.latitude,
      destination_longitude: matched.longitude,
    }));

    setDestinationError("");
    return true;
  };

  const startTravel = async () => {
    if (!currentUser?.id) {
      setStatusMessage("User session missing. Please log in again.");
      return;
    }

    const destinationResolved =
      formData.destination_latitude !== "" &&
      formData.destination_longitude !== ""
        ? true
        : resolveDestination();

    if (!destinationResolved) {
      setStatusMessage("Please enter a supported destination first.");
      return;
    }

    if (
      formData.source_latitude === "" ||
      formData.source_longitude === "" ||
      formData.destination.trim() === "" ||
      formData.destination_latitude === "" ||
      formData.destination_longitude === ""
    ) {
      setStatusMessage("Please allow current location and enter a valid destination first.");
      return;
    }

    try {
      const payload = {
        user_id: currentUser.id,
        source: formData.source,
        destination: formData.destination,
        source_latitude: Number(formData.source_latitude),
        source_longitude: Number(formData.source_longitude),
        destination_latitude: Number(formData.destination_latitude),
        destination_longitude: Number(formData.destination_longitude),
        deviation_threshold_m: Number(formData.deviation_threshold_m),
      };

      const response = await api.post("/travel/start", payload);
      setTravelData(response.data);

      setLiveLocation({
        latitude: response.data?.last_latitude ?? payload.source_latitude ?? "",
        longitude: response.data?.last_longitude ?? payload.source_longitude ?? "",
      });

      localStorage.setItem("herguardian_travel_active", "true");
      setStatusMessage("Safe travel started successfully.");
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        setStatusMessage(String(error.response.data.detail));
        return;
      }

      setStatusMessage("Failed to start travel session.");
    }
  };

  const refreshTravelStatus = async () => {
    if (!travelData?.id) {
      setStatusMessage("Start a travel session first.");
      return;
    }

    try {
      const response = await api.get(`/travel/${travelData.id}`);
      setTravelData(response.data);
      setStatusMessage("Travel status refreshed.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to fetch travel status.");
    }
  };

  const syncCurrentLocation = async () => {
    if (!travelData?.id) {
      setStatusMessage("Start a travel session first.");
      return;
    }

    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setStatusMessage("Syncing current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));

        try {
          const response = await api.post(`/travel/update/${travelData.id}`, {
            latitude,
            longitude,
          });

          setLiveLocation({ latitude, longitude });

          setTravelData((prev) => ({
            ...prev,
            last_latitude: response.data.last_latitude,
            last_longitude: response.data.last_longitude,
            status: response.data.status,
            deviation_flag: response.data.deviation_flag,
            deviation_distance_m: response.data.deviation_distance_m,
            deviation_threshold_m: response.data.deviation_threshold_m,
            auto_alert_sent: response.data.auto_alert_sent,
            emergency_triggered: response.data.emergency_triggered,
          }));

          if (response.data.auto_alert || response.data.auto_incident) {
            setStatusMessage("Route deviation detected. Incident and alert triggered.");
          } else if (response.data.destination_reached) {
            localStorage.setItem("herguardian_travel_active", "false");
            setStatusMessage("Destination reached. Travel completed.");
          } else {
            setStatusMessage("Current location synced successfully.");
          }
        } catch (error) {
          console.error(error);

          if (error?.response?.data?.detail) {
            setStatusMessage(String(error.response.data.detail));
          } else {
            setStatusMessage("Failed to sync current location.");
          }
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setStatusMessage("Unable to access current location.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const triggerEmergency = async () => {
    if (!travelData?.id) {
      setStatusMessage("Start a travel session first.");
      return;
    }

    const latitude =
      liveLocation.latitude !== ""
        ? Number(liveLocation.latitude)
        : Number(formData.source_latitude);

    const longitude =
      liveLocation.longitude !== ""
        ? Number(liveLocation.longitude)
        : Number(formData.source_longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setStatusMessage("Current location unavailable. Please sync location first.");
      return;
    }

    try {
      const response = await api.post(`/travel/emergency/${travelData.id}`, {
        latitude,
        longitude,
        message: "I feel unsafe during travel",
      });

      setStatusMessage(response.data.message || "Emergency triggered.");
      setTravelData((prev) => ({
        ...prev,
        emergency_triggered: true,
        last_latitude: latitude,
        last_longitude: longitude,
      }));
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        setStatusMessage(String(error.response.data.detail));
        return;
      }

      setStatusMessage("Failed to trigger emergency.");
    }
  };

  const endTravel = async () => {
    if (!travelData?.id) {
      setStatusMessage("Start a travel session first.");
      return;
    }

    try {
      const response = await api.post(`/travel/end/${travelData.id}`);
      setTravelData(response.data);
      localStorage.setItem("herguardian_travel_active", "false");
      setStatusMessage("Travel ended successfully.");
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        setStatusMessage(String(error.response.data.detail));
        return;
      }

      setStatusMessage("Failed to end travel.");
    }
  };

  const source =
    formData.source_latitude !== "" && formData.source_longitude !== ""
      ? {
          latitude: Number(formData.source_latitude),
          longitude: Number(formData.source_longitude),
        }
      : null;

  const destination =
    formData.destination_latitude !== "" &&
    formData.destination_longitude !== ""
      ? {
          latitude: Number(formData.destination_latitude),
          longitude: Number(formData.destination_longitude),
        }
      : null;

  const currentLocation =
    travelData?.last_latitude != null && travelData?.last_longitude != null
      ? {
          latitude: travelData.last_latitude,
          longitude: travelData.last_longitude,
        }
      : liveLocation.latitude !== "" && liveLocation.longitude !== ""
      ? {
          latitude: Number(liveLocation.latitude),
          longitude: Number(liveLocation.longitude),
        }
      : source;

  const routeSafetyLabel = useMemo(() => {
    if (!travelData?.id) return "Not Started";
    if (travelData?.emergency_triggered) return "Emergency Active";
    if (travelData?.deviation_flag) return "Deviation Detected";
    if (travelData?.status === "completed") return "Completed";
    return "On Track";
  }, [travelData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Safe Travel</h1>
        <p className="mt-2 text-slate-400">
          Start a protected trip, track your route, and get emergency support when needed.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-2xl border border-pink-500 bg-pink-500/10 px-4 py-3 text-pink-200">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-xl font-semibold">Start Safe Travel</h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="text-sm text-slate-400">Current Location</div>
              <div className="mt-2 text-base font-semibold text-white">
                {formData.source_latitude !== "" && formData.source_longitude !== ""
                  ? `${formData.source_latitude}, ${formData.source_longitude}`
                  : "Location not detected yet"}
              </div>

              <button
                onClick={detectCurrentLocation}
                className="mt-3 rounded-xl bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600"
              >
                {locationLoading ? "Detecting..." : "Use My Current Location"}
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">Destination</label>
              <input
                type="text"
                value={formData.destination}
                onChange={handleDestinationInput}
                onBlur={resolveDestination}
                placeholder="Type destination (e.g. Gachibowli)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none"
              />
              {destinationError && (
                <p className="mt-2 text-sm text-pink-300">{destinationError}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Supported for now: Gachibowli, Hitech City, Secunderabad, Ameerpet, Kukatpally, Madhapur
              </p>
            </div>

            <button
              onClick={startTravel}
              className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white hover:bg-pink-600"
            >
              Start Travel
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-xl font-semibold">Trip Controls</h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="text-sm text-slate-400">Selected Destination</div>
              <div className="mt-2 text-base font-semibold text-white">
                {formData.destination || "No destination selected"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={refreshTravelStatus}
                disabled={!travelData?.id}
                className="rounded-xl bg-slate-700 px-4 py-3 font-semibold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Refresh Status
              </button>

              <button
                onClick={syncCurrentLocation}
                disabled={!hasActiveTravel}
                className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sync Current Location
              </button>

              <button
                onClick={triggerEmergency}
                disabled={!hasActiveTravel}
                className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Emergency
              </button>

              <button
                onClick={endTravel}
                disabled={!hasActiveTravel}
                className="rounded-xl bg-slate-500 px-4 py-3 font-semibold text-white hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                End Travel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-4 text-xl font-semibold">Travel Map</h2>
        <TravelMap
          source={source}
          destination={destination}
          currentLocation={currentLocation}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm text-slate-400">Trip Status</h3>
          <p className="mt-2 text-lg font-semibold text-pink-400">
            {travelData?.status ?? "Not Started"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm text-slate-400">Route Safety</h3>
          <p className="mt-2 text-lg font-semibold">{routeSafetyLabel}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm text-slate-400">Deviation Distance</h3>
          <p className="mt-2 text-lg font-semibold">
            {travelData?.deviation_distance_m ?? 0} m
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm text-slate-400">Emergency State</h3>
          <p className="mt-2 text-lg font-semibold">
            {travelData?.emergency_triggered ? "Triggered" : "Normal"}
          </p>
        </div>
      </div>
    </div>
  );
}
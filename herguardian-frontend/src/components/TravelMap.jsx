import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TravelMap({ source, destination, currentLocation }) {
  const center = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [17.385, 78.4867];

  const route =
    source && destination
      ? [
          [source.latitude, source.longitude],
          [destination.latitude, destination.longitude],
        ]
      : [];

  return (
    <div className="h-[450px] w-full overflow-hidden rounded-2xl border border-slate-800">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {source && (
          <Marker position={[source.latitude, source.longitude]}>
            <Popup>Source</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.latitude, destination.longitude]}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {currentLocation && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>Current Location</Popup>
          </Marker>
        )}

        {route.length === 2 && <Polyline positions={route} />}
      </MapContainer>
    </div>
  );
}
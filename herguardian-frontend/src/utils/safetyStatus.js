export const getBatteryInfo = async () => {
  try {
    if (!navigator.getBattery) {
      return {
        supported: false,
        level: null,
        charging: null,
        lowBattery: false,
      };
    }

    const battery = await navigator.getBattery();

    return {
      supported: true,
      level: Math.round(battery.level * 100),
      charging: battery.charging,
      lowBattery: battery.level <= 0.2 && !battery.charging,
    };
  } catch (error) {
    console.error("Battery API failed:", error);
    return {
      supported: false,
      level: null,
      charging: null,
      lowBattery: false,
    };
  }
};

export const getInternetStatus = () => {
  return navigator.onLine;
};

export const getLocationStatus = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        available: false,
        message: "Geolocation is not supported in this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        resolve({
          available: true,
          message: "Location available",
        });
      },
      () => {
        resolve({
          available: false,
          message: "Location unavailable",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

export const deriveOverallSafetyState = ({
  isEmergency = false,
  isTraveling = false,
  isOnline = true,
  hasLocation = true,
  lowBattery = false,
}) => {
  if (isEmergency) {
    return {
      label: "Emergency Triggered",
      tone: "critical",
      description: "Emergency assistance may be required immediately.",
    };
  }

  if (!isOnline) {
    return {
      label: "Offline",
      tone: "warning",
      description: "Internet connection is unavailable.",
    };
  }

  if (!hasLocation) {
    return {
      label: "No Location",
      tone: "warning",
      description: "Live location is currently unavailable.",
    };
  }

  if (lowBattery) {
    return {
      label: "Low Battery",
      tone: "warning",
      description: "Battery is low and may affect safety tracking.",
    };
  }

  if (isTraveling) {
    return {
      label: "Traveling",
      tone: "info",
      description: "Safe travel monitoring is active.",
    };
  }

  return {
    label: "Normal",
    tone: "success",
    description: "All core safety systems look normal.",
  };
};
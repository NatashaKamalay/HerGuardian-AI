const CHECKINS_KEY = "herguardian_checkins";

export const getCheckIns = () => {
  try {
    const raw = localStorage.getItem(CHECKINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read check-ins:", error);
    return [];
  }
};

export const saveCheckIns = (checkIns) => {
  try {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
  } catch (error) {
    console.error("Failed to save check-ins:", error);
  }
};

export const addCheckIn = ({ status, note, locationText }) => {
  const existing = getCheckIns();

  const newCheckIn = {
    id: Date.now().toString(),
    status,
    note: note?.trim() || "",
    locationText: locationText?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  const updated = [newCheckIn, ...existing].slice(0, 10);
  saveCheckIns(updated);

  return {
    success: true,
    data: newCheckIn,
  };
};
const STORAGE_KEY = "agentic-cinema-logs";
const EVENT_NAME = "agentic-cinema-log";

export function addAppLog(level, message, detail = "") {
  const logs = getAppLogs();

  const entry = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    level,
    message,
    detail,
  };

  logs.push(entry);

  // Keep the most recent 200 logs
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(logs.slice(-200))
  );

  window.dispatchEvent(new Event(EVENT_NAME));

  return entry;
}

export function getAppLogs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearAppLogs() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeToAppLogs(callback) {
  window.addEventListener(EVENT_NAME, callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
  };
}
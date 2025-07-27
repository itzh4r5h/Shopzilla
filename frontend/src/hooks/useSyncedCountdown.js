import { useEffect, useState } from "react";
import { formatTime } from "../utils/helpers";

export const useSyncedCountdown = (key) => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    // Try from localStorage first
    const saved = localStorage.getItem(key);
    const expiryTime = saved || 0;

    if (expiryTime === 0 || !expiryTime) return 0;

    const diff = Math.floor((new Date(expiryTime) - new Date()) / 1000);
    return diff > 0 ? diff : 0;
  });

  // Countdown tick
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval)

  }, [secondsLeft]);

  // Reset manually (or when new time arrives from server)
  const reset = (expiresAt) => {
    if (!expiresAt) return;

    const expiry = new Date(expiresAt).toISOString();
    localStorage.setItem(key, expiry);

    const diff = Math.floor((new Date(expiry) - new Date()) / 1000);
    setSecondsLeft(diff > 0 ? diff : 0);
  };

  const formatted = formatTime(secondsLeft);

  return {
    secondsLeft,
    formatted,
    reset,
  };
};

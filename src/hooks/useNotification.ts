import React from "react";

export const useNotification = (alerts: any[]) => {
  React.useEffect(() => {
    if ("Notification" in window) {
      // Request permission if not already granted
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      if (Notification.permission === "granted" && alerts.length > 0) {
        // Show only the first alert to avoid spamming
        const alert = alerts[0];
        new Notification(`⚠️ ${alert.event}`, {
          body: alert.description,
        });
      }
    }
  }, [alerts]);
};


import React from "react";
import { useNotification } from "../hooks/useNotification";

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({
  alerts = [],
}) => {
  const [showAlerts, setShowAlerts] = React.useState(true);
  useNotification(alerts);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!alerts.length) {
    return null;
  }

  return (
    <section className="weatherAlert">
      <div className="sectionHeader">
        <h2>Weather Alerts</h2>

        <button
          type="button"
          onClick={() => setShowAlerts((prev) => !prev)}
          aria-expanded={showAlerts}
        >
          {showAlerts ? "Hide" : "Show"}
        </button>
      </div>

      {showAlerts && (
        <div className="alertList">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.event}-${alert.start}-${index}`}
              className="alertCard"
              role="alert"
            >
              <h3>{alert.event}</h3>

              <p>
                <strong>Issued by:</strong>{" "}
                {alert.sender_name}
              </p>

              <p>
                <strong>Starts:</strong>{" "}
                {formatTime(alert.start)}
              </p>

              <p>
                <strong>Ends:</strong>{" "}
                {formatTime(alert.end)}
              </p>

              <p>{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
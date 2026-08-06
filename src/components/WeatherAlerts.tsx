import React from "react";

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

interface WeatherAlertProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertProps> = ({
  alerts = []
}) => {

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000)
      .toLocaleString();
  };

  if (!alerts.length) {
    return null;
  }
  return (
    <div className="weatherAlert">

      <h2>
        ⚠️ Severe Weather Alerts
      </h2>


      {alerts.map((alert,index)=>(

        <div 
          key={index}
          className="alertCard"
        >
          <h3>
            {alert.event}
          </h3>
          <p>
            Issued by:
            {" "}
            {alert.sender_name}
          </p>
          <p>
            Starts:
            {" "}
            {formatTime(alert.start)}
          </p>
          <p>
            Ends:
            {" "}
            {formatTime(alert.end)}
          </p>
          <p>
            {alert.description}
          </p>

        </div>

      ))}

    </div>
  );
};
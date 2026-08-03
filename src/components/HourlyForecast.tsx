import React from "react";
import { iconChanger } from "./IconChanger";

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    temp: number;
    weather: { main: string }[];
  }[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData = [] }) => {
  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "numeric", hour12: true });
  };

  return (
    <div className="hourlyForecast">
      <h2>24‑Hour Forecast</h2>
      <div className="forecastScroll">
        {hourlyData.slice(0, 24).map((hour) => (
          <div
            key={hour.dt}
            className="forecastHour"
            aria-label={`At ${formatHour(hour.dt)}, ${hour.weather[0].main}, ${hour.temp}°C`}
          >
            <p>{formatHour(hour.dt)}</p>
            <div className="forecastIcon">{iconChanger(hour.weather[0].main)}</div>
            <p>{hour.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

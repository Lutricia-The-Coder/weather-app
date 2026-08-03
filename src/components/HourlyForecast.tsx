import React from "react";
import { iconChanger } from "./IconChanger";

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    temp: number;
    weather: { main: string }[];
  }[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  return (
    <div className="hourlyForecast">
      <h2>24‑Hour Forecast</h2>
      <div className="forecastScroll">
        {hourlyData.slice(0, 24).map((hour) => (
          <div key={hour.dt} className="forecastHour">
            <p>{new Date(hour.dt * 1000).getHours()}:00</p>
            {iconChanger(hour.weather[0].main)}
            <p>{hour.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

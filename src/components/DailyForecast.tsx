import React from "react";
import { iconChanger } from "./IconChanger";

interface DailyForecastProps {
  dailyData: {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { main: string }[];
  }[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  return (
    <div className="dailyForecast">
      <h2>7‑Day Forecast</h2>
      <div className="forecastGrid">
        {dailyData.slice(0, 7).map((day) => (
          <div key={day.dt} className="forecastDay">
            <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
            {iconChanger(day.weather[0].main)}
            <p>Day: {day.temp.day}°C</p>
            <p>Min: {day.temp.min}°C / Max: {day.temp.max}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

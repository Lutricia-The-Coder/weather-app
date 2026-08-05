import React from "react";
import { iconChanger } from "./IconChanger";

interface DailyForecastProps {
  dailyData: {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { main: string }[];
  }[];
  unit?: string; // default "°C"
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData = [], unit = "°C" }) => {
  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString([], { weekday: "short" });
  };

  return (
    <div className="dailyForecast">
      <h2>5 - Day Forecast</h2>
      <div className="forecastGrid">
        {dailyData.slice(0, 7).map((day) => (
          <div
            key={day.dt}
            className="forecastDay"
            aria-label={`${formatDay(day.dt)}: ${day.weather[0].main}, Day ${day.temp.day}${unit}, Min ${day.temp.min}${unit}, Max ${day.temp.max}${unit}`}
          >
            <p>{formatDay(day.dt)}</p>
            <div className="forecastIcon">{iconChanger(day.weather[0].main)}</div>
            <p>Day: {Math.round(day.temp.day)}{unit}</p>
            <p>Min: {day.temp.min}{unit} / Max: {day.temp.max}{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

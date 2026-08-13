import React from "react";
import { iconChanger } from "./IconChanger";

interface DailyForecastProps {
  dailyData: {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { main: string ;
      icon:string;
      description:string;
    };
  }[];
  unit: "C" | "F";
  convertTemp: (temp: number) => number;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData = [], unit , convertTemp }) => {
  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString([], { weekday: "short" });
  };

  return (
    <div className="dailyForecast" style={{fontFamily: "-apple-system"}}>
      <h2>5 - Day Forecast</h2>
      <div className="forecastGrid">
        {dailyData.slice(0,5).map((day) => (
          <div
            key={day.dt}
            className="forecastDay"
            aria-label={`${formatDay(day.dt)}:
            ${day.weather.main},
            Day ${convertTemp(day.temp.day)}°${unit},
            Min ${convertTemp(day.temp.min)}°${unit},
            Max ${convertTemp(day.temp.max)}°${unit}`}
          >
            <p>{formatDay(day.dt)}</p>
            <div className="forecastIcon">
              {iconChanger(day.weather.icon,
                day.weather.description
              )}</div>
            <p>Day: {convertTemp(day.temp.day)}°{unit}</p>
            <p> L:{convertTemp(day.temp.min)}°{unit}{"  "}
H:{convertTemp(day.temp.max)}°{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

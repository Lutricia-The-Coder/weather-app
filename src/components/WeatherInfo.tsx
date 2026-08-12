import React from "react";
import { iconChanger } from "./IconChanger";

interface WeatherInfoProps {
  name: string;
  country: string;
  temp: number;
  weather: string;
  icon:string;
  unit:string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ name, country, temp, weather,icon, unit }) => (
  <div className="weatherArea">
    <h1>{name}</h1>
    <span>{country}</span>
    <div className="icon">{iconChanger(icon,weather)}</div>
    <h1> {Math.round(temp)}°{unit}</h1>
    <h2>{weather}</h2>
  </div>
);

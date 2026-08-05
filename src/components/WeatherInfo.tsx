import React from "react";
import { iconChanger } from "./IconChanger";

interface WeatherInfoProps {
  name: string;
  country: string;
  temp: number;
  weather: string;
  unit:string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ name, country, temp, weather, unit }) => (
  <div className="weatherArea">
    <h1>{name}</h1>
    <span>{country}</span>
    <div className="icon">{iconChanger(weather)}</div>
    <h1> {Math.round(temp)}°{unit}</h1>
    <h2>{weather}</h2>
  </div>
);

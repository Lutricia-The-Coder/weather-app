import React from "react";
import { iconChanger } from "./IconChanger";

interface WeatherInfoProps {
  name: string;
  country: string;
  temp: number;
  weather: string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ name, country, temp, weather }) => (
  <div className="weatherArea">
    <h1>{name}</h1>
    <span>{country}</span>
    <div className="icon">{iconChanger(weather)}</div>
<<<<<<< HEAD
    <h1> {Math.round(temp)}°C</h1>
=======
    <h1>{temp}°C</h1>
>>>>>>> 00537363583975e05b69489b12770ae06e1dfc6e
    <h2>{weather}</h2>
  </div>
);

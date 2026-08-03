import React from "react";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";

interface BottomInfoProps {
  humidity: number;
  windSpeed: number;
}

export const BottomInfo: React.FC<BottomInfoProps> = ({ humidity, windSpeed }) => (
  <div className="bottomInfoArea">
    <div className="humidityLevel">
      <WiHumidity className="windIcon" />
      <div className="humidInfo">
        <h1>{humidity}%</h1>
        <p>Humidity</p>
      </div>
    </div>
    <div className="wind">
      <FaWind className="windIcon" />
      <div className="humidInfo">
        <h1>{windSpeed} km/h</h1>
        <p>Wind speed</p>
      </div>
    </div>
  </div>
);

import React from "react";
import { BsFillSunFill, BsCloudyFill, BsFillCloudRainFill, BsCloudFog2Fill, BsSnow } from "react-icons/bs";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { WiThunderstorm, WiSmoke, WiDust } from "react-icons/wi";

export const iconChanger = (weather: string) => {
  let iconElement: React.ReactNode;
  let iconColor: string;

  switch (weather) {
    case "Rain":
    case "Drizzle":
      iconElement = <BsFillCloudRainFill />;
      iconColor = "#272829";
      break;

    case "Clear":
      iconElement = <BsFillSunFill />;
      iconColor = "#FFC436";
      break;

    case "Clouds":
      iconElement = <BsCloudyFill />;
      iconColor = "#102C57";
      break;

    case "Mist":
    case "Haze":
    case "Fog":
      iconElement = <BsCloudFog2Fill />;
      iconColor = "#279EFF";
      break;

    case "Snow":
      iconElement = <BsSnow />;
      iconColor = "#00BFFF";
      break;

    case "Thunderstorm":
      iconElement = <WiThunderstorm />;
      iconColor = "#6C3483";
      break;

    case "Smoke":
      iconElement = <WiSmoke />;
      iconColor = "#7D7D7D";
      break;

    case "Dust":
    case "Sand":
      iconElement = <WiDust />;
      iconColor = "#C2B280";
      break;

    default:
      iconElement = <TiWeatherPartlySunny />;
      iconColor = "#7B2869";
  }

  return (
    <span className="icon" style={{ color: iconColor }}>
      {iconElement}
    </span>
  );
};

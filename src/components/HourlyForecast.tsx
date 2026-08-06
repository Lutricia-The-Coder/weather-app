
import { iconChanger } from "./IconChanger";

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    temp: number;
    weather: { main: string }[];
  }[];
  unit: "C" | "F";
  convertTemp: (temp: number) => number;
}

export const HourlyForecast = ({ hourlyData, unit, convertTemp }: HourlyForecastProps) => {
  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "numeric", hour12: true });
  };

  return (
    <div className="hourlyForecast">
      <h2>8 - Hour Forecast</h2>
      <div className="forecastScroll">
        {hourlyData.slice(0,8).map((hour) => (
          <div
            key={hour.dt}
            className="forecastHour"
            aria-label={
              `At ${formatHour(hour.dt)},
              ${hour.weather[0].main},
              ${convertTemp(hour.temp)}°${unit}`
            }
          >
            <p>{formatHour(hour.dt)}</p>
            <div className="forecastIcon">
              {iconChanger(hour.weather[0].main)}</div>
            <p>{convertTemp(hour.temp)}°{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

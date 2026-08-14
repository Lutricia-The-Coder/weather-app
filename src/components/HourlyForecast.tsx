
import { iconChanger } from "./IconChanger";

interface HourlyForecastProps {
  hourlyData: {
    dt: number;
    temp: number;
    weather: { main: string,
      icon:string,
      description:string;
     };
  }[];
  unit: "C" | "F";
  convertTemp: (temp: number) => number;
  timezone?: number;
}

export const HourlyForecast = ({ hourlyData, unit, convertTemp, timezone = 0 }: HourlyForecastProps) => {
  const formatHour = (timestamp: number) => {
    const utcDate = new Date(timestamp * 1000);
    const offsetHours = timezone / 3600;
    
    let hours = utcDate.getUTCHours() + offsetHours;
    if (hours >= 24) hours -= 24;
    if (hours < 0) hours += 24;
    
    const minutes = utcDate.getUTCMinutes();
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    return `${Math.floor(hour12)}:${String(Math.floor(minutes)).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="hourlyForecast" style={{fontFamily: "serif"}}>
      <h2>24 - Hour Forecast</h2>
      <div className="forecastScroll">
        {hourlyData.slice(0,8).map((hour) => (
          <div
            key={hour.dt}
            className="forecastHour"
            aria-label={
              `At ${formatHour(hour.dt)},
              ${hour.weather.main},
              ${convertTemp(hour.temp)}°${unit}`
            }
          >
            <p>{formatHour(hour.dt)}</p>
            <div className="forecastIcon">
              {iconChanger(hour.weather.icon,
                hour.weather.description
              )}</div>
            <p>{convertTemp(hour.temp)}°{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

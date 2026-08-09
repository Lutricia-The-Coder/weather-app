import React from "react";

interface WeatherHighlightsProps {
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  visibility: number;
  chanceOfRain: number;
  timezone:number;
  unit: "C" | "F";
  convertTemp: (temp: number) => number;
}

export const WeatherHighlights: React.FC<WeatherHighlightsProps> = ({
  feelsLike,
  humidity,
  pressure,
  windSpeed,
  sunrise,
  sunset,
  visibility,
  chanceOfRain,
  timezone,
  unit,
  convertTemp,
}) => {

  const formatTime = (timestamp: number) => {
   const date =  new Date((timestamp + timezone)*1000);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone:"UTC",
    });
  };

  return (
    <section className="weatherHighlights">

      <div className="sectionHeader">
        <h2>Today's Highlight</h2>
      </div>

      <div className="highlightGrid">

        {/* FEELS LIKE */}
        <div className="highlightCard">
          <div className="highlightTitle">
            🌡️ <span>Feels Like</span>
          </div>

          <strong>
            {convertTemp(feelsLike)}°{unit}
          </strong>
        </div>


        {/* HUMIDITY */}
        <div className="highlightCard">
          <div className="highlightTitle">
            💧 <span>Humidity</span>
          </div>

          <strong>
            {humidity}%
          </strong>

          <small>
            {humidity < 40
              ? "Dry"
              : humidity < 70
              ? "Comfortable"
              : "Humid"}
          </small>
        </div>


        {/* PRESSURE */}
        <div className="highlightCard">
          <div className="highlightTitle">
            🧭 <span>Pressure</span>
          </div>

          <strong>
            {pressure}
          </strong>

          <small>hPa</small>
        </div>


        {/* WIND */}
        <div className="highlightCard">
          <div className="highlightTitle">
            💨 <span>Wind Status</span>
          </div>

          <strong>
            {Math.round(windSpeed * 3.6)}
          </strong>

          <small>km/h</small>
        </div>


        {/* CHANCE OF RAIN */}
        <div className="highlightCard">
          <div className="highlightTitle">
            🌧️ <span>Chance of Rain</span>
          </div>

          <strong>
            {Math.round(chanceOfRain)}%
          </strong>
        </div>


        {/* VISIBILITY */}
        <div className="highlightCard">
          <div className="highlightTitle">
            👁️ <span>Visibility</span>
          </div>

          <strong>
            {(visibility / 1000).toFixed(1)}
          </strong>

          <small>km</small>
        </div>


        {/* SUNRISE */}
        <div className="highlightCard">
          <div className="highlightTitle">
            🌅 <span>Sunrise</span>
          </div>

          <strong>
            {formatTime(sunrise)}
          </strong>
        </div>


        {/* SUNSET */}
        <div className="highlightCard">
          <div className="highlightTitle">
            🌇 <span>Sunset</span>
          </div>

          <strong>
            {formatTime(sunset)}
          </strong>
        </div>

      </div>

    </section>
  );
};
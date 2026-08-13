import React from "react";
import {
  CloudSun,
  Moon,
  Sun,
  MapPin,
  X,
} from "lucide-react";

interface SidebarProps {
  savedCities: string[];
  loadCity: (city: string) => void;
  removeCity: (city: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  unit: "C" | "F";
  toggleUnit: () => void;
}

export const Sidebar = ({
  savedCities,
  loadCity,
  removeCity,
  theme,
  toggleTheme,
  unit,
  toggleUnit,
}: SidebarProps) => {
  const [showCities, setShowCities] = React.useState(false);

  return (
    <aside className="sidebar">

      <h1 className="sidebarTitle" style={{fontFamily: "fangsong"}}>
        <CloudSun size={30} strokeWidth={2} />
        <span>Weather App</span>
      </h1>

      <div className="sidebarControls" style={{fontFamily: "-apple-system"}}>

        <button
          className="toggleButton"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? (
            <>
              <Moon size={15} />
              <span>Dark</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span>Light</span>
            </>
          )}
        </button>

        <button
          className="unitButton"
          onClick={toggleUnit}
          aria-label={`Switch to Fahrenheit`}
        >
          °{unit}
        </button>

      </div>

      <button
        type="button"
        className="weatherButton"
        onClick={() => setShowCities((prev) => !prev)}
        aria-expanded={showCities}
      >
        <MapPin size={13} />
        <span>Saved Cities</span>
      </button>

      {showCities && (
        <div className="savedCities">

          {savedCities.length === 0 ? (
            <p className="noCities">
              No saved cities yet.
            </p>
          ) : (
            savedCities.map((city) => (
              <div className="savedCity" key={city}>

                <button
                  type="button"
                  className="cityButton"
                  onClick={() => loadCity(city)}
                >
                  {city}
                </button>

                <button
                  type="button"
                  className="removeCityButton"
                  onClick={() => removeCity(city)}
                  aria-label={`Remove ${city}`}
                >
                  <X size={16} />
                </button>

              </div>
            ))
          )}

        </div>
      )}

    </aside>
  );
};
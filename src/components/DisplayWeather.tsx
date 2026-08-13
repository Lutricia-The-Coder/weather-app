import React from "react";
import axios from "axios";
import { SearchBar } from "./SearchBar";
import { WeatherInfo } from "./WeatherInfo";
import { Loading } from "./Loading";
import { DailyForecast } from "./DailyForecast";
import { HourlyForecast } from "./HourlyForecast";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { WeatherAlerts, type WeatherAlert } from "./WeatherAlerts";
import { useNotification } from "../hooks/useNotification";
import { Sidebar } from "./Sidebar";
import { WeatherHighlights } from "./WeatherHighlights";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify"
interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: {
    main: string;
    description: string;
    icon:string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

interface ForecastDataProps {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      icon:string;
      description:string;
    }[];
    pop: number;
  }[];
}

export const DisplayWeather = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;
const apiEndpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(null);
  const [forecastData, setForecastData] = React.useState<ForecastDataProps | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [cachedWeather, setCachedWeather] = useLocalStorage<WeatherDataProps | null>("cachedWeather", null);
  const [cachedForecast, setCachedForecast] = useLocalStorage<ForecastDataProps | null>("cachedForecast", null);
  const [searchCity, setSearchCity] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [savedCities, setSavedCities] = useLocalStorage<string[]>("savedCities", []);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [unit, setUnit] = useLocalStorage<"C" | "F">("unit", "C");
  const [alerts, setAlerts] = React.useState<WeatherAlert[]>([]);
const [forecastView, setForecastView] =
  React.useState<"hourly" | "daily">("hourly");
  useNotification(alerts);
const [lastLoadedCity, setLastLoadedCity] = React.useState("");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const convertTemp = (temp: number) => {
    return unit === "C" ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
  };

  const getChanceOfRain = () => {
    if (!forecastData?.list?.length) return 0;
    return forecastData.list[0].pop * 100;
  };

  const requestWeatherData = async (url: string) => {
    if (!apiKey) {
      throw new Error("Weather API key is missing.");
    }

    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  };

  const fetchWeatherData = async (city: string) => {
    const url = await fetch(`${apiEndpoint}weather?q=${city}&appid=${apiKey}&units=metric`
    )
     const data = await url.json();
  return data; 
  };

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    const url = `${apiEndpoint}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return requestWeatherData(url);
  };

  const fetchForecast = async (lat: number, lon: number) => {
    const url = `${apiEndpoint}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return requestWeatherData(url);
  };

const fetchWeatherAlerts = async (
  lat: number,
  lon: number
): Promise<WeatherAlert[]> => {
  if (!apiKey) return [];

  try {
    const timelineUrl =
      `https://api.openweathermap.org/data/4.0/onecall/timeline/1h` +
      `?lat=${lat}` +
      `&lon=${lon}` +
      `&appid=${apiKey}` +
      `&units=metric`;

    const response = await axios.get(timelineUrl, {
      timeout: 10000,
    });

    const data = response.data?.data ?? [];

    // Get unique alert IDs from the timeline
    const alertIds = [
      ...new Set(
        data.flatMap(
          (item: { alerts?: string[] }) => item.alerts ?? []
        )
      ),
    ];

    if (alertIds.length === 0) {
      return [];
    }

    // Get the full information for each alert
    const alerts = await Promise.all(
      alertIds.map(async (alertId) => {
        try {
          const alertUrl =
            `https://api.openweathermap.org/data/4.0/onecall/alert/${alertId}` +
            `?appid=${apiKey}`;

          const alertResponse = await axios.get(alertUrl, {
            timeout: 10000,
          });

          return alertResponse.data;
        } catch (error) {
          console.error(
            `Failed to fetch alert ${alertId}:`,
            error
          );

          return null;
        }
      })
    );

    return alerts.filter(
      (alert): alert is WeatherAlert => alert !== null
    );
  } catch (error) {
    console.error("Failed to fetch weather alerts:", error);
    return [];
  }
};

  const saveCity = () => {
    if (!weatherData) return;

    const exists = savedCities.some((city) => city.toLowerCase() === weatherData.name.toLowerCase());
    if (!exists) {
      setSavedCities([...savedCities, weatherData.name]);
      toast.success("City saved sucessfully.")
    }else{
      toast.error("City already exists!");
    }
  };

  const removeCity = (city: string) => {
    setSavedCities((prev) => prev.filter((item) => item !== city));
 toast.error("City deleted!");
  };

  const applyWeatherData = (currentWeather: WeatherDataProps, forecast: ForecastDataProps, weatherAlerts: WeatherAlert[]) => {
    setWeatherData(currentWeather);
    setCachedWeather(currentWeather);
    setForecastData(forecast);
    setCachedForecast(forecast);
    setAlerts(weatherAlerts);
    setIsOffline(false);
    setError(null);
  };

  const loadCity = async (city: string) => {
    setSearchCity(city);
    setIsLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(city);
      const forecast = await fetchForecast(weather.coord.lat, weather.coord.lon);
      const weatherAlerts = await fetchWeatherAlerts(weather.coord.lat, weather.coord.lon);
      applyWeatherData(weather, forecast, weatherAlerts);
   setLastLoadedCity(weather.name);
    } catch {
      if (cachedWeather && cachedForecast) {
        setWeatherData(cachedWeather);
        setForecastData(cachedForecast);
        setIsOffline(true);
        setError(null);
      } else {
        setIsOffline(false);
        setError("Unable to load city.");
        setWeatherData(null)
        setForecastData(null)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
  const city = searchCity.trim();
  if (!city) return;

  if (city.toLowerCase() === lastLoadedCity.toLowerCase()) return;

  setIsLoading(true);
  setError(null);
  setIsOffline(false);

  try {
    const currentWeatherData = await fetchWeatherData(city);

    // ✅ Handle invalid city (OpenWeather returns cod=404 for not found)
    if (currentWeatherData.cod && currentWeatherData.cod !== 200) {
      setError("City not found. Please try again.");
      setWeatherData(null);
      setForecastData(null);
      return;
    }

    const forecast = await fetchForecast(
      currentWeatherData.coord.lat,
      currentWeatherData.coord.lon
    );
    const weatherAlerts = await fetchWeatherAlerts(
      currentWeatherData.coord.lat,
      currentWeatherData.coord.lon
    );

    applyWeatherData(currentWeatherData, forecast, weatherAlerts);
  } catch{
    if (!navigator.onLine) {
      // Only show offline if user is actually offline
      if (cachedWeather && cachedForecast) {
        setWeatherData(cachedWeather);
        setForecastData(cachedForecast);
        setIsOffline(true);
         setError("Showing cached data.");
      } else {
        setIsOffline(true);
        setError("No cached data available.");
      }
    } else {
      // ✅ Network/server error
      setError("Unable to load weather data. Please try again later.");
      setWeatherData(null);
      setForecastData(null);
    }
  } finally {
    setIsLoading(false);
  }
};

  const getHourlyData = () => {
    if (!forecastData?.list) return [];

    return forecastData.list.slice(0, 8).map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: {
        main: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description,}
    }));
  };

  const getDailyData = () => {
    if (!forecastData) return [];

    const dailyGroups: { [key: string]: typeof forecastData.list } = {};

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyGroups[date]) dailyGroups[date] = [];
      dailyGroups[date].push(item);
    });

    return Object.values(dailyGroups)
      .slice(0, 5)
      .map((dayForecasts) => {
        const temps = dayForecasts.map((item) => item.main.temp);

        return {
          dt: dayForecasts[0].dt,
          temp: {
            day: Math.round(dayForecasts[0].main.temp),
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps)),
          },
          weather: {main:dayForecasts[0].weather[0].main,
            icon:dayForecasts[0].weather[0].icon,
            description:dayForecasts[0].weather[0].description} 
        };
      });
  };
const loadCurrentLocation = () => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    return;
  }

  setIsLoading(true);
  setError(null);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const currentWeather =
          await fetchWeatherByCoordinates(
            latitude,
            longitude
          );

        const forecast = await fetchForecast(
          latitude,
          longitude
        );

        const weatherAlerts =
          await fetchWeatherAlerts(
            latitude,
            longitude
          );

        applyWeatherData(
          currentWeather,
          forecast,
          weatherAlerts
        );

        // Clear the search field because
        // we are showing the user's location.
        setSearchCity("");

      } catch {
        if (cachedWeather && cachedForecast) {
          setWeatherData(cachedWeather);
          setForecastData(cachedForecast);
          setIsOffline(true);
          setError(null);
        } else {
          setError(
            "Unable to load your current location."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    () => {
      setIsLoading(false);
      setError(
        "Location permission was denied. Please allow location access."
      );
    }
  );
};
  React.useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  React.useEffect(() => {
    const loadInitialWeather = async () => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        try {
          const data = await fetchWeatherData("Polokwane");
          const forecast = await fetchForecast(data.coord.lat, data.coord.lon);
          const weatherAlerts = await fetchWeatherAlerts(data.coord.lat, data.coord.lon);
          applyWeatherData(data, forecast, weatherAlerts);
        } catch {
          if (cachedWeather && cachedForecast) {
            setWeatherData(cachedWeather);
            setForecastData(cachedForecast);
            setIsOffline(true);
            setError(null);
          } else {
            setError("Unable to load weather data.");
          }
        } finally {
          setIsLoading(false);
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const currentWeather = await fetchWeatherByCoordinates(latitude, longitude);
            const forecast = await fetchForecast(latitude, longitude);
            const weatherAlerts = await fetchWeatherAlerts(latitude, longitude);
            applyWeatherData(currentWeather, forecast, weatherAlerts);
          } catch {
            try {
              const data = await fetchWeatherData("Polokwane");
              const forecast = await fetchForecast(data.coord.lat, data.coord.lon);
              const weatherAlerts = await fetchWeatherAlerts(data.coord.lat, data.coord.lon);
              applyWeatherData(data, forecast, weatherAlerts);
            } catch {
              if (cachedWeather && cachedForecast) {
                setWeatherData(cachedWeather);
                setForecastData(cachedForecast);
                setIsOffline(true);
                setError(null);
              } else {
                setError("Unable to fetch local weather data.");
              }
            }
          } finally {
            setIsLoading(false);
          }
        },
        async () => {
          try {
            const data = await fetchWeatherData("Polokwane");
            const forecast = await fetchForecast(data.coord.lat, data.coord.lon);
            const weatherAlerts = await fetchWeatherAlerts(data.coord.lat, data.coord.lon);
            applyWeatherData(data, forecast, weatherAlerts);
          } catch {
            if (cachedWeather && cachedForecast) {
              setWeatherData(cachedWeather);
              setForecastData(cachedForecast);
              setIsOffline(true);
              setError(null);
            } else {
              setError("Unable to load weather data.");
            }
          } finally {
            setIsLoading(false);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    };

    void loadInitialWeather();
  }, []);

  return (
    <div className={`app ${theme}`}>
      <div className="dashboard">
        <Sidebar
          savedCities={savedCities}
          loadCity={loadCity}
          removeCity={removeCity}
          theme={theme}
          toggleTheme={toggleTheme}
          unit={unit}
          toggleUnit={() => setUnit((prev) => (prev === "C" ? "F" : "C"))}
        />

        <main className="dashboardMain">
          <SearchBar
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            handleSearch={handleSearch}
            saveCity={saveCity}
          />
 <button
    type="button"
    className="locationButton"
    onClick={loadCurrentLocation}
  >
    📍 My Location
  </button>
         {isOffline && (
            <div className="offlineNotice" role="status">
              Youre offline. Showing the last cached weather data.
            </div>
          )}

          {isLoading ? (
            <Loading />
          ) : error ? (
            <p className="error">{error}</p>
          ) : weatherData ? (
            <>
              <WeatherInfo
                name={weatherData.name}
                country={weatherData.sys.country}
                temp={convertTemp(weatherData.main.temp)}
                weather={weatherData.weather[0].main}
                icon={weatherData.weather[0].icon}
                unit={unit}
              />

              <WeatherAlerts alerts={alerts} />


              <div className="forecastSection">
  <div className="forecastTabs">
    <button
      type="button"
      className={forecastView === "hourly" ? "active" : ""}
      onClick={() => setForecastView("hourly")}
    >
      Hourly
    </button>

    <button
      type="button"
      className={forecastView === "daily" ? "active" : ""}
      onClick={() => setForecastView("daily")}
    >
      Daily
    </button>
  </div>

  {forecastView === "hourly" ? (
    <HourlyForecast
      hourlyData={getHourlyData()}
      unit={unit}
      convertTemp={convertTemp}
      timezone={weatherData?.timezone}
    />
  ) : (
    <DailyForecast
      dailyData={getDailyData()}
      unit={unit}
      convertTemp={convertTemp}
      timezone={weatherData?.timezone}
    />
  )}
  
              <WeatherHighlights
                feelsLike={weatherData.main.feels_like}
                humidity={weatherData.main.humidity}
                pressure={weatherData.main.pressure}
                windSpeed={weatherData.wind.speed}
                sunrise={weatherData.sys.sunrise}
                sunset={weatherData.sys.sunset}
                visibility={weatherData.visibility}
                chanceOfRain={getChanceOfRain()}
                timezone={weatherData.timezone}
                unit={unit}
                convertTemp={convertTemp}
              />
                 <ToastContainer position="top-right" autoClose={3000} theme={theme} />

</div>
            </>
          ) : (
            <p className="error">Search for a city to get started.</p>
          )}
        </main>
      </div>
    </div>
  );
};
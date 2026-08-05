import React from "react";
import axios from "axios";
import { SearchBar } from "./SearchBar";
import { WeatherInfo } from "./WeatherInfo";
import { BottomInfo } from "./BottomInfo";
import { Loading } from "./Loading";
import { DailyForecast } from "./DailyForecast";
import { HourlyForecast } from "./HourlyForecast";

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
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
    }[];
  }[];
}

export const DisplayWeather = () => {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY as string;
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] =
    React.useState<WeatherDataProps | null>(null);

  const [forecastData, setForecastData] =
    React.useState<ForecastDataProps | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
const [theme, setTheme] = React.useState<"light" | "dark">("light");
const [unit, setUnit] = React.useState<"C" | "F">("C");

// Toogle theme
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : "light"
    );
  };

  // Current weather by city
  const fetchWeatherData = async (city: string) => {
    const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number
) => {
  const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

  const response = await axios.get(url);

  return response.data;
};
  // 5 day / 3 hour forecast
  const fetchForecast = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);

    return response.data;
  };


  // Convert API data for HourlyForecast component
  const getHourlyData = () => {
    if (!forecastData?.list) return [];

    return forecastData.list.slice(0, 8).map((item) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
      weather: item.weather,
    }));
  };


  // Convert API data for DailyForecast component
const getDailyData = () => {
  if (!forecastData?.list) return [];

  const dailyGroups: {
    [key: string]: typeof forecastData.list;
  } = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
      .toISOString()
      .split("T")[0];

    if (!dailyGroups[date]) {
      dailyGroups[date] = [];
    }

    dailyGroups[date].push(item);
  });


  return Object.values(dailyGroups)
    .slice(0, 5)
    .map((dayForecasts) => {

      const temps = dayForecasts.map(
        item => item.main.temp
      );


      // closest forecast to midday
      const dayTemp =
        dayForecasts.find(item =>
          new Date(item.dt * 1000)
            .getHours() === 12
        )?.main.temp
        ?? dayForecasts[0].main.temp;


      const representativeWeather =
        dayForecasts.find(item =>
          new Date(item.dt * 1000)
            .getHours() === 12
        )?.weather
        ?? dayForecasts[0].weather;


      return {
        dt: dayForecasts[0].dt,

        temp: {
          day: Math.round(dayTemp),

          min: Math.round(Math.min(...temps)),

          max: Math.round(Math.max(...temps)),
        },

        weather: representativeWeather,
      };
    });
};


  const handleSearch = async () => {
    if (!searchCity.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentWeatherData = await fetchWeatherData(searchCity);

      setWeatherData(currentWeatherData);

      const forecast = await fetchForecast(
        currentWeatherData.coord.lat,
        currentWeatherData.coord.lon
      );

      setForecastData(forecast);

    } catch (err) {
      console.error("Weather error:", err);

      setError("City not found or unable to fetch weather data.");

      setWeatherData(null);
      setForecastData(null);

    } finally {
      setIsLoading(false);
    }
  };


  React.useEffect(() => {
    setIsLoading(true);

    if (!navigator.geolocation) {
  setError("Location is not supported by your browser.");
  return;
}
navigator.geolocation.getCurrentPosition(
  async (position) => {
    try {
      const { latitude, longitude } = position.coords;


      const currentWeather =
        await fetchWeatherByCoordinates(
          latitude,
          longitude
        );


      setWeatherData(currentWeather);


      const forecast =
        await fetchForecast(
          latitude,
          longitude
        );


      setForecastData(forecast);

    } catch (err) {
      console.error(err);
      setError("Unable to fetch local weather data.");

    } finally {
      setIsLoading(false);
    }
  },

      async () => {
        try {
          const data = await fetchWeatherData("Polokwane");

          setWeatherData(data);

          const forecast = await fetchForecast(
            data.coord.lat,
            data.coord.lon
          );

          setForecastData(forecast);

        } catch (err) {
          setError("Unable to fetch default city weather.");

        } finally {
          setIsLoading(false);
        }
      }
    );

  }, []);



return (
  <div className={`MainWrapper ${theme}`}>
    <button
      className="themeButton"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>

    <div className="container">

      <SearchBar
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        handleSearch={handleSearch}
      />


      {isLoading ? (

        <Loading />

      ) : error ? (

        <p className="error">{error}</p>

      ) : weatherData ? (

        <>

          <WeatherInfo
            name={weatherData.name}
            country={weatherData.sys.country}
            temp={weatherData.main.temp}
            weather={weatherData.weather[0].main}
          />


          <BottomInfo
            humidity={weatherData.main.humidity}
            windSpeed={weatherData.wind.speed}
          />


          {forecastData && (

            <>

              <HourlyForecast
                hourlyData={getHourlyData()}
              />


              <DailyForecast
                dailyData={getDailyData()}
              />

            </>

          )}

        </>

      ) : (

        <p>No weather data available</p>

      )}

    </div>
    </div>
  );
};
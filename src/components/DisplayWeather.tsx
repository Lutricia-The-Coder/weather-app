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

  const [weatherData, setWeatherData] =React.useState<WeatherDataProps | null>(null);
 const [forecastData, setForecastData] = React.useState<ForecastDataProps | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const[savedCities, setSavedCities] = React.useState<string[]>(() =>{
    const saved = localStorage.getItem("savedCities");
    return saved ? JSON.parse(saved) : [];
  });
const [theme, setTheme] = React.useState<"light" | "dark">(() => {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
});
const [unit, setUnit] = React.useState<"C" | "F">(() => {
  return localStorage.getItem("unit") === "F" ? "F" : "C";
});
//persisst them to local storage
React.useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);

//persist theme to local storage
React.useEffect(() => {
  localStorage.setItem("unit", unit);
}, [unit]);

// Toogle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  //convert temp from 'c to F
  const convertTemp = (temp: number) => {
    if(unit === "C") {
      return Math.round(temp);
    }
    return Math.round((temp * 9) / 5 + 32);
  }

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

//save cities 
const saveCity = () => {
  if(!weatherData) return;

  if (!savedCities.includes(weatherData.name)) {
    const updatedCities = [...savedCities, weatherData.name];
    setSavedCities(updatedCities);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  }
};  
//remove a city
const removeCity = (city: string) => {
  const updatedCities = savedCities.filter(item => item !== city
  );
  setSavedCities(updatedCities);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
}

const loadCity = async (city: string) => {
  setSearchCity(city);
  setIsLoading(true);
  setError(null);
  try {
    const weather = await fetchWeatherData(city);
    setWeatherData(weather);
    const forecast = await fetchForecast(
      weather.coord.lat,
      weather.coord.lon
    );
    setForecastData(forecast);
  } catch (err) {
    setError("Unable to load city.");
  } finally {
    setIsLoading(false);
  }
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

    } catch {
      setError("City not found.");

      setWeatherData(null);
      setForecastData(null);

    } finally {
      setIsLoading(false);
    }
  };


  // Convert API data for HourlyForecast component
  const getHourlyData = () => {
    if (!forecastData?.list) return [];

    return forecastData.list.slice(0, 8).map((item) => ({
      dt: item.dt,
      temp:item.main.temp,
      weather: item.weather,
    }));
  };


  // Convert API data for DailyForecast component
const getDailyData = () => {
  if (!forecastData) return [];

  const dailyGroups: {
    [key: string]: typeof forecastData.list;
  } = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();

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
        dayForecasts.map(item => item.main.temp);

      return {
        dt: dayForecasts[0].dt,

        temp: {
          day: Math.round(dayForecasts[0].main.temp),

          min: Math.round(Math.min(...temps)),

          max: Math.round(Math.max(...temps)),
        },

        weather: dayForecasts[0].weather
      };
    });
};

  React.useEffect(() => {
    setIsLoading(true);

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

    } catch {
      setError("Unable to fetch local weather data.");

    } finally {
      setIsLoading(false);
    }
  },

      async () => {
      
          const data = await fetchWeatherData("Polokwane");

          setWeatherData(data);

          const forecast = await fetchForecast(
            data.coord.lat,
            data.coord.lon
          );

          setForecastData(forecast);
setIsLoading(false);
      }
    );
  }, []);

return (
  <div className={`MainWrapper ${theme}`}>
    <button
      className="themeButton"
      onClick={toggleTheme}>
    
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
<button
  className="unitButton"
  onClick={() =>
    setUnit(prev => prev === "C" ? "F" : "C")
  }
>
  °{unit}
</button>
    <div className="container">

      <SearchBar
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        handleSearch={handleSearch}
      saveCity={saveCity}
      savedCities={savedCities}
      loadCity={loadCity}
      removeCity={removeCity}
 />

      {isLoading ? 
 <Loading />

      : error ? 

        <p className="error">{error}</p>

      : weatherData &&
        <>

          <WeatherInfo
            name={weatherData.name}
            country={weatherData.sys.country}
            temp={convertTemp(weatherData.main.temp)}
            weather={weatherData.weather[0].main}
            unit={unit}
          />


          <BottomInfo
            humidity={weatherData.main.humidity}
            windSpeed={Math.round(weatherData.wind.speed * 3.6)}
          />

              <HourlyForecast
                hourlyData={getHourlyData()}
                unit={unit}
              />


              <DailyForecast
                dailyData={getDailyData()}
                unit={unit}
              />

            </>

        }

        </div>
        </div>
  );
}

    
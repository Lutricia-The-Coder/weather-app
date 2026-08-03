import React from "react";
import axios from "axios";
import { MainWrapper } from "./styles.module";
import { SearchBar } from "./SearchBar";
import { WeatherInfo } from "./WeatherInfo";
import { BottomInfo } from "./BottomInfo";
import { Loading } from "./Loading";

interface WeatherDataProps {
  name: string;
  main: { temp: number; humidity: number };
  sys: { country: string };
  weather: { main: string }[];
  wind: { speed: number };
}

export const DisplayWeather = () => {
  const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState("");

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const fetchWeatherData = async (city: string) => {
    const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
    const searchResponse = await axios.get(url);
    return searchResponse.data;
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") return;
    try {
      const currentWeatherData = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
      setIsLoading(true);
    } catch {
      console.error("No results found");
    }
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
        setWeatherData(currentWeather);
        setIsLoading(true);
      });
    });
  }, []);

  return (
    <MainWrapper>
      <div className="container">
        <SearchBar searchCity={searchCity} setSearchCity={setSearchCity} handleSearch={handleSearch} />
        {weatherData && isLoading ? (
          <>
            <WeatherInfo
              name={weatherData.name}
              country={weatherData.sys.country}
              temp={weatherData.main.temp}
              weather={weatherData.weather[0].main}
            />
            <BottomInfo humidity={weatherData.main.humidity} windSpeed={weatherData.wind.speed} />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </MainWrapper>
  );
};

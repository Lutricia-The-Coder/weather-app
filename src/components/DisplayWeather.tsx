import { MainWrapper } from "./styles.module"
import { AiOutlineSearch } from "react-icons/ai"
import { WiHumidity } from "react-icons/wi"
import { FaWind } from "react-icons/fa6";
import { BsFillSunFill , BsCloudyFill , BsFillCloudRainFill , BsCloudFog2Fill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import React from "react";


export const DisplayWeather = () => {

    const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
    const api_Endpoint ="https://api.openweathermap.org/data/2.5/";

    const fetchCurrentWeather = async (lat:number , lon:number) => {
const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units =metric`
const response = await axios.get(url);
return response.data;
    }

    React.useEffect(() =>{
navigator.geolocation.getCurrentPosition((position) => {
    const {latitude , longitude } = position.coords;
    Promise.all([fetchCurrentWeather(latitude , longitude)]).then(
([currentWeather]) => {
console.log(currentWeather)
}
    )
})

    })
  return (
    <MainWrapper>
        <div className="container">
            <div className="searchArea">
                <input type="text" placeholder="enter a city" />
            
            <div className="searchCircle">
             <AiOutlineSearch  className="searchIcon"/>
            </div>
        </div>
        <div className="weatherArea">
            <h1>Name</h1>
            <span>country</span>
            <div className="icon">
                  icon
            </div>
            <h1>Temperature</h1>
            <h2>cloud</h2>
        </div>

        <div className="bottomInfoArea">
            <div className="humidityLevel">
              <WiHumidity className="windIcon" />
             <div className="humidInfo">
                <h1>perc</h1>
                <p>Humidity</p>
           </div>
            </div>
            
            <div className="wind">
                < FaWind  className ="windIcon" />
                  <div className="humidInfo">
                <h1>km</h1>
                <p>windspeed</p>
            </div>
            </div>
        </div>
        </div>
    </MainWrapper>

  )
}

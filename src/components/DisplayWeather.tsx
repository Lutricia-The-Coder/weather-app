import { MainWrapper } from "./styles.module"
import { AiOutlineSearch } from "react-icons/ai"

export const DisplayWeather = () => {

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

            </div>
            <h1>Temperature</h1>
            <h2>cloud</h2>
        </div>
        </div>
    </MainWrapper>

  )
}

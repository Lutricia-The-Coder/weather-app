import React from "react";

interface SidebarProps {
  savedCities: string[];
  loadCity: (city:string)=>void;
  removeCity: (city:string)=>void;
  theme: "light" | "dark";
  toggleTheme: ()=>void;
  unit: "C" | "F";
  toggleUnit: ()=>void;
}

export const Sidebar = ({
  savedCities,
  loadCity,
  removeCity,
  theme,
  toggleTheme,
  unit,
  toggleUnit
}: SidebarProps) => {

const [showCities, setShowCities] = React.useState(false);
return (
<aside className="sidebar">

<h1>
🌦 Weather App
</h1>


<div className="sidebarControls">

<button 
className="toggleButton"
onClick={toggleTheme}
>
{theme === "light" ? "🌙 Dark" : "☀️ Light"}
</button>


<button
className="unitButton"
onClick={toggleUnit}
>
°{unit}
</button>

</div>



<button type="button" className="weatherButton" onClick={() => setShowCities((prev) => !prev)}
 aria-expanded={showCities} >
   📍 Saved Cities </button> 
   
   {showCities && ( 
    <div className="savedCities">
       {savedCities.length === 0 ? 
       ( <p className="noCities">
         No saved cities yet. </p> )
          : ( savedCities.map((city) =>
             ( <div className="savedCity" key={city} > 
             <button type="button" 
             className="cityButton" 
             onClick={() => loadCity(city)} >
               {city} </button> 
               
               <button type="button"
               className="removeCityButton"
                onClick={() => removeCity(city)}
                 aria-label={`Remove ${city}`} >
                   × </button> 
                   </div> )) )}
                    </div> )}
                     </aside> );
                      };
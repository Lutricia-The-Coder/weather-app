import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarProps {
  searchCity: string;
  setSearchCity: (city: string) => void;
  handleSearch: () => void;
      saveCity(): void;
      savedCities: string[];
    loadCity: (city: string) => void;
    removeCity: (city: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchCity, setSearchCity, handleSearch , saveCity, savedCities, loadCity, removeCity}) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();

  };

  return (
    <form className="searchArea" onSubmit={onSubmit}>
      <input 
        type="text" 
        placeholder="Enter a city"
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
        aria-label="Search city"
      />
      <button type="submit" className="searchCircle">
        <AiOutlineSearch className="searchIcon" />
      </button>

      <button type="button" className="saveButton" onClick={saveCity}>
        Save City
      </button>

      <div className="savedCities">

  <h3>Saved Locations</h3>

  {savedCities.length === 0 ? 
    <p>No saved locations</p> :

savedCities.map((city) => (
  <div key={city} className="cityItem">
    
      <button type="button" 
        onClick={() => loadCity(city)}
      >
        {city}
      </button>

      <button
        className="deleteButton"
        aria-label={`Delete ${city}`}
        onClick={() => removeCity(city)}
      >
        ✖
      </button>

    </div>

  ))}

</div>
    </form>
  );
};

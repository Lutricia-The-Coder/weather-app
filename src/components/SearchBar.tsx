import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarProps {
  searchCity: string;
  setSearchCity: (city: string) => void;
  handleSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchCity, setSearchCity, handleSearch }) => (
  <div className="searchArea">
    <input 
      type="text" 
      placeholder="Enter a city"
      value={searchCity}
      onChange={(e) => setSearchCity(e.target.value)}
    />
    <div className="searchCircle">
      <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
    </div>
  </div>
);

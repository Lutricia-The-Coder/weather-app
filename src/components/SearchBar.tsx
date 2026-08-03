import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarProps {
  searchCity: string;
  setSearchCity: (city: string) => void;
  handleSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchCity, setSearchCity, handleSearch }) => {
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
    </form>
  );
};

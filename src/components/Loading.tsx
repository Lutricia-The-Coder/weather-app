import React from "react";
import { RiLoaderFill } from "react-icons/ri";

export const Loading: React.FC = () => (
  <div className="loading">
    <RiLoaderFill className="loading-icon" />
    <p>Loading</p>
  </div>
);

import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

const Result = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <SearchBar />
      </div>
    </div>
  );
};

export default Result;

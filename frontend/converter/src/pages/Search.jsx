import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchIcon from "../assets/image/search.png";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  // const location = useLocation();

  const handleSearchResults = (result) => {
    setSearchResults(result);
  }

  return (
    <div>
      <Navbar />
      <Footer />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-[1000px] w-[95%] text-center mb-[30px]">
          <div className="flex justify-center">
            <img src={SearchIcon} className="w-1/5" />
          </div>

          <div className="font-semibold text-[40px] tracking-[0px] text-[#955ed3] text-center">
            MIPS Instruction Converter
          </div>

          <div className="text-[15px] tracking-[0px] text-[#955ed3] text-center mb-2.5">
            This tool will helps you to convert the MIPS Instruction to
            R-format/I-format, Binary, Decimal, Hexadecimal.
            <br />
            This will also show you how to have that result.
          </div>

          <SearchBar inputWidth={100} onSearchResults={handleSearchResults} />
        </div>
      </div>
    </div>
  );
};

export default Search;

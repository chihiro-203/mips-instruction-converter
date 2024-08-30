import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { FaPaw } from "react-icons/fa6";
import Explain from "../components/Explain";
import BinHexDec from "../components/BinHexDec";
import { useLocation } from "react-router-dom";

const Result = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const handleSearchResults = (result) => {
    setSearchResults(result);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mips = params.get("mips");
    if (mips) {
      // handleSearchResults(mips);
      // You can initiate a search with the mips here if needed
    }
  }, [location.search]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-[1350px] w-[95%] text-center justify-between mt-[50px]">
          <SearchBar inputWidth={80} onSearchResults={handleSearchResults} />
          <div className="flex flex-row justify-between items-center w-full mt-[15px];">
            <div className="panel binary">
              <h4>Explanation</h4>
              <div className="line"></div>
              <div
                className="result my-[12px]"
              ><Explain searchResults={searchResults} /></div>
            </div>
            <div className="panel hex-dec">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Bin <FaPaw style={{ fontSize: '12px', margin: '0 10px' }} /> Hex <FaPaw style={{ fontSize: '12px', margin: '0 10px' }} /> Dec
              </h4>
              <div className="line"></div>
              <div
                className="result my-[15px]"
              ><BinHexDec searchResults={searchResults} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

const Result = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-[1350px] w-[95%] text-center justify-between mt-[50px]">
          <SearchBar inputWidth={80}/>
          <div className="results">
            <div className="panel binary">
              <h4>Binary</h4>
              <div className="line"></div>
              <div
                // style="margin-top: 15px; margin-bottom: 15px"
                className="result"
              ></div>
              <div></div>
            </div>
            <div className="panel hex-dec">
              <h4>Hexadecimal & Decimal</h4>
              <div className="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

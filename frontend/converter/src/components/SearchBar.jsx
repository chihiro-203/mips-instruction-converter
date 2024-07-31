import React, { useState } from "react";
import { FaPaw } from "react-icons/fa6";
import axiosInstance from "../utils/axiosInstance";

const SearchBar = ({ inputWidth }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Search for MIPS instruction
  const onSearch = async (e) => {
    e.preventDefault();
  
    // Add a random parameter to prevent caching
    const timestamp = new Date().getTime();
    const url = `/get-data?keyword=${searchTerm}&t=${timestamp}`; 
  
    try {
      const res = await axiosInstance.get(url, { cache: false });
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  return (
    <div
      className="m-auto bg-[white] h-fit flex items-center border-[#955ed3] justify-between px-2.5 py-[5px] rounded-[40px] border-[2.5px] border-solid"
      style={{ width: `${inputWidth}%` }}
    >
      <input
        type="text"
        className="bg-transparent w-[90%] outline-none text-[15px] text-[#8a51ab] p-2.5 placeholder:text-[15px] placeholder:text-[#955ed3]"
        placeholder="Searching MIPS Instruction... (e.g. add $s0 $s1 $s2)"
        id="search-input"
        name="mips="
        required
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button type="submit" className="search-btn" onClick={onSearch}>
        <FaPaw />
      </button>
    </div>
  );
};

export default SearchBar;

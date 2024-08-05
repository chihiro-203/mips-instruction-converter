import React, { useState } from "react";
import { FaPaw } from "react-icons/fa6";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateMIPS } from "../utils/helper";

const SearchBar = ({ inputWidth }) => {
  let [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Search for MIPS instruction
  const onSearch = async (e) => {
    e.preventDefault();

    // Validate keyword
    if (!validateMIPS(searchTerm)) {
      setError("Wrong Syntax of MIPS Instruction");
      return;
    }

    setError(null); // Clear error if validation passes

    searchTerm = validateMIPS(searchTerm);

    // Add a random parameter to prevent caching
    const timestamp = new Date().getTime();
    const url = `search-mips?mips=${searchTerm}&t=${timestamp}`;

    try {
      const res = await axiosInstance.get(url, { cache: false });
      console.log(res.data);
      navigate(url);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  return (
    <div>
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

      {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
    </div>
  );
};

export default SearchBar;

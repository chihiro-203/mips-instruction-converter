import React, { useEffect, useState } from "react";
import { FaPaw } from "react-icons/fa6";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { validateMIPS } from "../utils/helper";

const SearchBar = ({ inputWidth, onSearchResults }) => {
  let [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("mips");
    if (term) {
      setSearchTerm(term);
    }
  }, [location.search]);

  // Search for MIPS instruction
  const onSearch = async (e) => {
    e.preventDefault();

    // Validate keyword
    if (!validateMIPS(searchTerm)) {
      setError("Wrong Syntax of MIPS Instruction");
      return;
    }

    setError(null); 

    searchTerm = validateMIPS(searchTerm);

    const url = `search-mips?mips=${searchTerm}`;

    try {
      const res = await axiosInstance.get(url, { cache: false });
      console.log(res.data);
      if (onSearchResults) {
        onSearchResults(res.data); 
      }
      navigate(url, { state: { results: res.data } }); 
      // onSearchResults(res.data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  return (
    <form>
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
    </form>
  );
};

export default SearchBar;

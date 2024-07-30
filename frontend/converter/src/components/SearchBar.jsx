import React from "react";
import { FaPaw } from "react-icons/fa6";

const SearchBar = ({inputWidth}) => {
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
      />

      <button type="submit" className="search-btn">
        <FaPaw />
      </button>
    </div>
  );
};

export default SearchBar;
import React from "react";
import Navbar from "../components/Navbar";
import SearchIcon from "../assets/search.png";
import { FaPaw } from "react-icons/fa6";

const Search = () => {
  return (
    <div>
      <Navbar />
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

          <div className="bg-[white] h-fit w-full flex items-center border-[#955ed3] justify-between px-2.5 py-[5px] rounded-[40px] border-[2.5px] border-solid">
            <input
              type="text"
              className="bg-transparent w-[90%] outline-none text-[15px] text-[#8a51ab] p-2.5 placeholder:text-[15px] placeholder:text-[#955ed3]"
              placeholder="Searching MIPS Instruction... (e.g. add $s0 $s1 $s2)"
              id="search-input"
              name="mips="
              required
            />
            {/* <!-- <button type="submit" class="searching-submit"><i class="fa-solid fa-paw"></i></button> --> */}
            <button type="submit" className="search-btn">
              <FaPaw />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

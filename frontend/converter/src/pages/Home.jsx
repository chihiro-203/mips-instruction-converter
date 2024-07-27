import React from "react";
import { Link } from "react-router-dom";
// import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFile,
  FaFileCode,
  FaRegFile,
  FaRegFileCode,
} from "react-icons/fa6";
import HomeNavbar from "../components/HomeNavbar";

const Home = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="flex items-center justify-center h-screen">
        <div className="flex justify-center items-center flex-1 max-w-[1150px] mx-[50px] my-0">
          <div className="logo-box transition">
            <div className="logo-text transition">
              Instruction
              <br />
              Converter
            </div>
            <Link to="/search" className="cir-btn converter-icon transition">
              <FaArrowRight />
              <FaArrowLeft />
              {/* <i className="fas fa-arrow-right bottom-icon"></i>
                            <i className="fas fa-arrow-left top-icon"></i> */}
            </Link>
          </div>
          <div className="logo-box transition">
            <div className="logo-text transition">
              Register
              <br />
              Usage
            </div>
            <Link to="/register" className="cir-btn register-icon transition">
              <FaRegFile />
              {/* <FaRegFileCode /> */}
              {/* <i className="fa-regular fa-file" id="register-icon"></i> */}
            </Link>
          </div>
          <div className="logo-box transition">
            <div className="logo-text transition">
              Operation
              <br />
              Code
            </div>
            <Link to="/opcode" className="cir-btn opcodes-icon transition">
              <FaFile />
              {/* <FaFileCode /> */}
              {/* <i className="fa-solid fa-file" id="opcode-icon"></i> */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

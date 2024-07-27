import React, { useState } from "react";
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
  const [isHoveringArrowRight, setIsHoveringArrowRight] = useState(false);
  const [isHoveringArrowLeft, setIsHoveringArrowLeft] = useState(false);
  const [isHoveringFileReg, setIsHoveringFileReg] = useState(false);
  const [isHoveringFile, setIsHoveringFile] = useState(false);

  const handleArrowOver = () => {
    setIsHoveringArrowRight(true);
    setIsHoveringArrowLeft(true);
  };
  const handleArrowOut = () => {
    setIsHoveringArrowRight(false);
    setIsHoveringArrowLeft(false);
  };
  const handleFileRegOver = () => {
    setIsHoveringFileReg(true);
  };
  const handleFileRegOut = () => {
    setIsHoveringFileReg(false);
  };
  const handleFileOver = () => {
    setIsHoveringFile(true);
  };
  const handleFileOut = () => {
    setIsHoveringFile(false);
  };

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
            <Link
              to="/search"
              className="cir-btn converter-icon transition"
              onMouseOver={handleArrowOver}
              onMouseOut={handleArrowOut}
            >
              <FaArrowRight
                style={{
                  transform: isHoveringArrowRight
                    ? "translateX(5px)"
                    : "translateX(0)",
                  transition: "transform 0.2s ease-in-out",
                }}
              />{" "}
              <FaArrowLeft
                style={{
                  transform: isHoveringArrowLeft
                    ? "translateX(-5px)"
                    : "translateX(0)",
                  transition: "transform 0.2s ease-in-out",
                }}
              />{" "}
            </Link>
          </div>
          <div className="logo-box transition">
            <div className="logo-text transition">
              Register
              <br />
              Usage
            </div>
            <Link
              to="/register"
              className="cir-btn register-icon transition"
              onMouseOver={handleFileRegOver}
              onMouseOut={handleFileRegOut}
            >
              {isHoveringFileReg ? <FaRegFileCode /> : <FaRegFile />}
            </Link>
          </div>
          <div className="logo-box transition">
            <div className="logo-text transition">
              Operation
              <br />
              Code
            </div>
            <Link
              to="/opcode"
              className="cir-btn opcodes-icon transition"
              onMouseOver={handleFileOver}
              onMouseOut={handleFileOut}
            >
              {isHoveringFile ? <FaFileCode /> : <FaFile />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

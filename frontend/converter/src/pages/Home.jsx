import React from 'react'
import { Link } from "react-router-dom";
// import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight, FaFile, FaFileCode, FaRegFile, FaRegFileCode } from "react-icons/fa6";
import HomeNavbar from '../components/HomeNavbar';



const Home = () => {
  return (
    <div>
        <HomeNavbar />
        <div className="flex items-center justify-center h-screen">
        <div className="flex justify-center items-center flex-1 max-w-[1150px] mx-[50px] my-0">
                <div className="logo-box">
                    <div className="logo-layer">
                        <div className="logo-text">Instruction<br />Converter</div>
                        <Link to="/search" className="cir-btn converter-icon">
                        {/* <a href="#instructionConverter" className="cir-btn converter-icon" id="searching-open"> */}
                            <FaArrowRight />
                            <FaArrowLeft />
                            {/* <i className="fas fa-arrow-right bottom-icon"></i>
                            <i className="fas fa-arrow-left top-icon"></i> */}
                        </Link>
                    </div>
                </div>
                <div className="logo-box">
                    <div className="logo-layer">
                        <div className="logo-text">Register<br />Usage</div>
                        <Link to="/register" className="cir-btn register-icon">
                        {/* <a href="#registerUsage" className="cir-btn register-icon" id="register-btn"> */}
                            <FaRegFile />
                            {/* <FaRegFileCode /> */}
                            {/* <i className="fa-regular fa-file" id="register-icon"></i> */}
                            </Link>
                    </div>
                </div>
                <div className="logo-box">
                    <div className="logo-layer">
                        <div className="logo-text">Operation<br />Code</div>
                        <Link to="/opcode" className="cir-btn opcodes-icon">
                        {/* <a href="#opcodes" className="cir-btn opcodes-icon" id="opcode-btn"> */}
                            <FaFile />
                            {/* <FaFileCode /> */}
                            {/* <i className="fa-solid fa-file" id="opcode-icon"></i> */}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
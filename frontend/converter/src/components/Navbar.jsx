import React from "react";
import { Link, useLocation } from "react-router-dom";
import Theme from "./Theme";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed h-20 w-full px-5 py-0">
      <nav className="nav max-w-[100vw] w-full">
        <Link
          to="/home"
          className={`text-[#9665dd] text-[25px] font-bold ${
            location.pathname === "/home" ? "text-[#5f3c91]" : ""
          }`}
        >
          HOME
        </Link>
        <nav className="navbar">
          <Link
            to="/search" 
            className={`link ${
              location.pathname.startsWith("/search") ? "active" : ""
            }`}
          >
            Instruction Converter
          </Link>
          <Link
            to="/register"
            className={`link ${
              location.pathname === "/register" ? "active" : ""
            }`}
          >
            Register Usage
          </Link>
          <Link
            to="/opcode"
            className={`link ${
              location.pathname === "/opcode" ? "active" : ""
            }`}
          >
            Operation Code
          </Link>

          <Theme />
        </nav>
      </nav>
    </div>
  );
};

export default Navbar;

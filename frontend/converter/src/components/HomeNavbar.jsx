import React from 'react'
import { Link } from "react-router-dom";
import Theme from "./Theme";

const HomeNavbar = () => {
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
          <Theme />
        </nav>
      </nav>
    </div>
  )
}

export default HomeNavbar
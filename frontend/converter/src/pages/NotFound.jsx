import React from "react";
import Navbar from "../components/Navbar";
import NotFoundIcon from "../assets/image/404.png";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <Footer />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-[1000px] w-[95%] text-center mb-[30px]">
          <div className="flex justify-center">
            <img src={NotFoundIcon} className="w-1/5" />
          </div>

          <div className="font-semibold text-[30px] tracking-[0px] text-[#7549b3] text-center">
            404 - Meow!
          </div>

          <div className="text-[18px] tracking-[0px] text-[#7549b3] text-center mb-2.5">
            Looks like this cat got lost. The page you're looking for is nowhere
            to be found.
            <br />
            Return to the{" "}
            <Link
              className="text-[#955ed3] font-semibold hover:underline"
              to="/"
            >
              Search Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

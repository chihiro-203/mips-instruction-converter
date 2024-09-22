import React from "react";
import { FaPaw } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full flex justify-center items-center py-[5px] absolute bottom-0 text-[#955ed3]">
      <div className="text-[10px] flex items-center space-x-2">
        <FaPaw />
        <span>Copyright &copy; 2024 by Chi Nguyen | All Rights Reversed</span>
        <FaPaw />
      </div>
    </div>
  );
};

export default Footer;

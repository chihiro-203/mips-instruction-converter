import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Theme = () => {
  // Default to light mode
  const [mode, setMode] = useState("light");

  // Load the theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setMode(savedMode);
    }
    document.body.className = mode;
  }, [mode]);

  // Toggle theme function
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode); // Save the theme to localStorage
  };

  // Apply the theme to the body
  useEffect(() => {
    document.body.className = mode;

    const logoBoxs = document.querySelectorAll(".logo-box");    
    const logoTexts = document.querySelectorAll(".logo-text");
    const cirBtns = document.querySelectorAll(".cir-btn");

    logoBoxs.forEach(box => {
      box.classList.remove("light", "dark");
      box.classList.add(mode);
    });

    logoTexts.forEach(text => {
      text.classList.remove("light", "dark");
      text.classList.add(mode);
    });

    cirBtns.forEach(btn => {
      btn.classList.remove("light", "dark");
      btn.classList.add(mode);
    });
  }, [mode]);

  return (
    <button onClick={toggleTheme}>
      {mode === "dark" ? (
        <FaMoon className="text-[#e3d6f6] text-xl" />
      ) : (
        <FaSun className="text-[#330044] text-xl" />
      )}
    </button>
  );
};

export default Theme;

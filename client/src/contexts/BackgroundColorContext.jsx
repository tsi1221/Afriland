import React, { useState, useEffect, createContext } from "react";
import { ThemeContext, themes } from "../../contexts/ThemeContext";

export const BackgroundColorContext = createContext({
  color: "blue",
  changeColor: () => {},
});

export const backgroundColors = {
  primary: "primary",
  blue: "blue",
  green: "green",
};

export default function AppContextWrapper({ children }) {
  // Theme state
  const [theme, setTheme] = useState(themes.light);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    if (theme === themes.light) {
      document.body.classList.add("white-content");
    } else {
      document.body.classList.remove("white-content");
    }
  }, [theme]);

  // Background color state
  const [bgColor, setBgColor] = useState(backgroundColors.blue);

  const changeBgColor = (color) => {
    setBgColor(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <BackgroundColorContext.Provider
        value={{ color: bgColor, changeColor: changeBgColor }}
      >
        {children}
      </BackgroundColorContext.Provider>
    </ThemeContext.Provider>
  );
}

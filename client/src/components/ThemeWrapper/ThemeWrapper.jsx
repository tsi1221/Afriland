import React, { useState, useEffect } from "react";
import { ThemeContext, themes } from "../../contexts/ThemeContext";

export default function ThemeContextWrapper({ children }) {
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

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

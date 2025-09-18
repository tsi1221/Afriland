import { createContext } from "react";

export const themes = {
  dark: "",          // No extra class for dark mode
  light: "white-content", // Add "white-content" class to body for light mode
};

export const ThemeContext = createContext({
  theme: themes.light, // default theme
  changeTheme: () => {}, // placeholder function
});

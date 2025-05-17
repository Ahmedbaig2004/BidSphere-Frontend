import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    // Check if a theme preference is stored in localStorage
    const storedTheme = localStorage.getItem('lightTheme');
    if (storedTheme !== null) {
      setIsLightTheme(JSON.parse(storedTheme));
    }
  }, []);

  const toggleTheme = () => {
    const newThemeValue = !isLightTheme;
    setIsLightTheme(newThemeValue);
    localStorage.setItem('lightTheme', JSON.stringify(newThemeValue));
  };

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 
import { useState, useEffect } from "react";

const useTheme = (window?: Window) => {
  // Function to get the preferred theme from the system
  const getPreferredTheme = () => {
    if (
      window?.matchMedia &&
      window?.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  // Initialize theme from window.localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = window?.localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const preferredTheme = getPreferredTheme();
    window?.localStorage.setItem("theme", preferredTheme);
    return preferredTheme;
  };

  useEffect(() => {
    const savedTheme = window?.localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme)
      return;
    }

    const getPreferredTheme = () =>
      window?.matchMedia &&
      window?.matchMedia("(prefers-color-scheme: dark)").matches
     ? "dark" : "light";

    const preferredTheme = getPreferredTheme();
    window?.localStorage.setItem("theme", preferredTheme);
    setTheme(preferredTheme)
    return;
  },[window])

  const [theme, setTheme] = useState(initializeTheme);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    window?.localStorage.setItem("theme", newTheme);
  };

  // Update the className of the body tag whenever the theme changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;

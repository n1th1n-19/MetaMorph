"use client";
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Force dark theme
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "#B0BEC5",
    },
  },
  cssVariables: {
    colorSchemeSelector: "html", // Ensure only dark mode is applied
  },
});

export default darkTheme;

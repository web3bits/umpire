import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3D5A80",
      light: "#E0FBFC",
      dark: "#212939",
      // contrastText: "#262f3e",
    },
    secondary: {
      main: "#EC6C4D",
      light: "#FFF",
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: "#fff",
    },
  },
});

export default theme;

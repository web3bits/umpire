import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { makeStyles, createStyles } from "@mui/styles";
export const useGlobalClasses = makeStyles(
  createStyles({
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      maxWidth: "100%",
      paddingTop: ".5rem",
      paddingBottom: ".5rem",
    },
    row: {
      marginTop: "1rem",
    },
    container: {
      margin: "1rem",
    },
    centeredRow: {
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    link: {
      textDecoration: "none",
      cursor: "pointer",
    },
    mt2: {
      marginTop: "2rem",
    },
    mt3: {
      marginTop: "3rem",
    },
    mt4: {
      marginTop: "4rem",
    },
  })
);
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

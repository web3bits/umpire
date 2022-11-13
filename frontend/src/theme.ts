import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { makeStyles, createStyles } from "@mui/styles";
export const useGlobalClasses = makeStyles(
  createStyles({
    background: {
      backgroundImage: "url('./assets/background.jpg')",
      backgroundSize: "cover",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: "0 !important",
    },
    whiteFont: {
      color: "#FFFFFF",
    },
    whiteButton: {
      color: "#FFFFFF",
      borderColor: "#FFFFFF",
      "&:hover": {
        borderColor: "#FFFFFF",
      },
    },
    bold: {
      fontWeight: "bold",
    },
    primaryFont: {
      color: "#1976d2",
    },
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
    signinContainer: {
      margin: "0 auto",
      height: "100%",
      minHeight: "100vh",
      display: "block",
    },
    centeredRow: {
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    link: {
      textDecoration: "none",
      cursor: "pointer !important",
    },
    mr2: {
      marginRight: "2rem",
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
    withBorder: {
      border: "1px solid black",
      borderRadius: 5,
      padding: ".8rem",
    },
    fullWidth: { width: "100%" },
    activationDateRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
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

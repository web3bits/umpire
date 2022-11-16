import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { makeStyles, createStyles } from "@mui/styles";
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
export const useGlobalClasses = makeStyles(
  createStyles({
    background: {
      backgroundImage: "url('./assets/background.png')",
      backgroundSize: "100%",
      backgroundColor: "#000",
      backgroundRepeat: "no-repeat",
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
    variableValue: {
      width: 150,
    },
    flexRow: {
      display: "flex",
      marginTop: "1rem",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    inlineBlock: {
      display: "inline-block",
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
    ml2: {
      marginLeft: "2rem",
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
    formulaInput: { width: "100%" },
    formulaList: { marginTop: 5 },
    formulaListValue: {
      borderRadius: 4,
      border: "1px solid #cccccc",
      width: "100%",
      padding: ".5rem 0",
      "&:hover": {
        color: "#ffffff",
        background: theme.palette.primary.main,
        cursor: "pointer",
      },
    },
    formulaValue: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    },
  })
);

export default theme;

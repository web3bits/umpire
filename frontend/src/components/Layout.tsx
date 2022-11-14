import React from "react";
import { Container, Box } from "@mui/material";
import { GlobalSpinner } from "./GlobalSpinner"; // Import using relative path
import { makeStyles } from "@mui/styles";
import { useGlobalContext } from "../context/GlobalContext";
import { Header } from "./Header";
import { RequireAuth } from "./RequireAuth";
import { Drawer } from "../components/drawer/Drawer";

const useStyles: any = makeStyles((theme: any) => ({
  // root: {
  //   maxWidth: '1200px',
  // },
  darkBg: {
    background: theme.palette.primary.main,
  },
  secondaryBg: {
    background: theme.palette.secondary.light,
  },
  greyBg: {
    background: "#e4e4e4",
  },
  blackBg: {
    background: "#000",
  },
  "@keyframes animate": {
    "100%": {
      backgroundPosition: "-3000px 0",
    },
  },
  container: {
    marginLeft: "17.125rem",
    padding: "0rem 0.5rem",
  },
  drawer: {
    display: "block",
    position: "fixed",
    top: 0,
    bottom: 0,
    width: "100%",
    maxWidth: "15.625rem",
    overflowY: "auto",
    padding: 0,
    background: "linear-gradient(195deg,#42424a,#191919)",
    color: "#FFFFFF",
    borderRadius: "0.75rem",
    margin: "1rem 0rem 1rem 1rem",
  },
}));

export const Layout = ({ children }: { children: any }) => {
  const { isLoading } = useGlobalContext();
  const classes = useStyles();

  return (
    <RequireAuth>
      <>
        {isLoading && <GlobalSpinner />}
        <Box
          component="aside"
          // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          className={classes.drawer}
        >
          <Drawer />
        </Box>
        <Box
          component="main"
          className={classes.container}
          // sx={{width: {sm: containerWidth} }}
          //sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          {children}
        </Box>
        {/* <Header /> */}
      </>
    </RequireAuth>
  );
};
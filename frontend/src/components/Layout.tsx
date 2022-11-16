import React from "react";
import { Box } from "@mui/material";
import { GlobalSpinner } from "./GlobalSpinner";
import { makeStyles } from "@mui/styles";
import { useGlobalContext } from "../context/GlobalContext";
import { RequireAuth } from "./RequireAuth";
import { Drawer } from "../components/drawer/Drawer";
import {Container } from "@mui/material";

const useStyles: any = makeStyles((theme: any) => ({
  main: {
    height: "calc(100vh - 2rem)",
    width: "calc(100% - 18.625rem)",
    margin: "1rem 1rem 1rem auto",
    borderRadius: "0.75rem",
    overflow: "auto",
  },
  container: {
    minHeight: "100%",
    minWidth: "100%",
    padding: "1rem",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%)",
    backgroundColor: "#ffffff",
    
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
          className={classes.drawer}
        >
          <Drawer />
        </Box>
        <Box
          component="main"
          className={classes.main}
        >
          <Container className={classes.container}>{children}</Container>
        </Box>
      </>
    </RequireAuth>
  );
};
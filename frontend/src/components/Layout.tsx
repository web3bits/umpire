import React from "react";
import { Container, Box } from "@mui/material";
import { GlobalSpinner } from "./GlobalSpinner"; // Import using relative path
import { makeStyles } from "@mui/styles";
import { useGlobalContext } from "../context/GlobalContext";
import { Header } from "./Header";
import { RequireAuth } from "./RequireAuth";

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    maxWidth: "1200px",
  },
  darkBg: {
    background: theme.palette.primary.main,
  },
  secondaryBg: {
    background: theme.palette.secondary.light,
  },
  greyBg: {
    background: "#e4e4e4",
  },
  "@keyframes animate": {
    "100%": {
      backgroundPosition: "-3000px 0",
    },
  },
  container: {
    minHeight: "calc(100vh - 130px)",
    width: "100%",
    margin: "0 auto",
  },
}));

export const Layout = ({ children }: { children: any }) => {
  const { isLoading } = useGlobalContext();
  const classes = useStyles();

  return (
    <RequireAuth>
      <Box>
        <Header />
        {isLoading && <GlobalSpinner />}
        <Container>{children}</Container>
      </Box>
    </RequireAuth>
  );
};

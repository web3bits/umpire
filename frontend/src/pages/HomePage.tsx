import * as React from "react";
import { Typography, Box, Container } from "@mui/material";
import { useMoralis } from "react-moralis";

export const HomePage = () => {
  const { isAuthenticated, user } = useMoralis();

  return (
    <Container
      disableGutters
      maxWidth="sm"
      component="main"
      sx={{ py: 10, textAlign: "center" }}
    >
      <Typography
        component="h1"
        variant="h2"
        color={isAuthenticated && user ? "primary.dark" : "primary.light"}
        gutterBottom
      >
        <Box sx={{ fontWeight: 900 }}>
          {isAuthenticated && user
            ? "WELCOME TO UMPIRE"
            : "UMPIRE IS A DECENTRALIZED ..."}
        </Box>
      </Typography>
      <Box sx={{ fontWeight: 500 }}>
        <Typography component="p" color="primary.light">
          {!isAuthenticated && !user && "Umpire is a decentralized...!"}
        </Typography>
      </Box>
    </Container>
  );
};

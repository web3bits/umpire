import React from "react";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { useGlobalContext } from "../context/GlobalContext";

export const GlobalSpinner = () => {
  const { isLoading, loadingMessage } = useGlobalContext();
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <CircularProgress color="inherit" />
        </Grid>
        {loadingMessage && (
          <Grid item xs={12}>
            {loadingMessage}
          </Grid>
        )}
      </Grid>
    </Backdrop>
  );
};

import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import { useGlobalContext } from "../../context/GlobalContext";
import { useMoralis } from "react-moralis";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { GlobalSpinner } from "./GlobalSpinner";

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
  mapContainer: {
    minHeight: "calc(100vh - 130px)",
    width: "100%",
    backgroundRepeat: "repeat",
    backgroundPosition: "0 0",
    backgroundSize: "auto 100%",
    margin: "0 auto",
    animation: `$animate 100s linear infinite`,
  },
  container: {
    minHeight: "calc(100vh - 130px)",
    width: "100%",
    margin: "0 auto",
  },
}));

export const Layout = () => {
  // const router = useLocation();
  const requireAuth = false;
  const { isAuthenticated, user, isWeb3Enabled, enableWeb3 } = useMoralis();
  const { isLoading } = useGlobalContext();
  const classes = useStyles();

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3()
        .then()
        .catch((err: any) => console.error(err));
    }
  }, [isWeb3Enabled]);

  return (
    <div className={isAuthenticated ? classes.greyBg : classes.darkBg}>
      {isLoading && <GlobalSpinner />}
      <div
        className={
          isAuthenticated && user ? classes.container : classes.mapContainer
        }
      >
        <Container disableGutters maxWidth="lg" component="main" sx={{ py: 0 }}>
          {requireAuth && !isAuthenticated && !user ? <Outlet /> : <Outlet />}
        </Container>
      </div>
    </div>
  );
};

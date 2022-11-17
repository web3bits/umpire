import * as React from "react";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import makeBlockie from "ethereum-blockies-base64";
import Link from "next/link";
import { useGlobalClasses } from "../theme";
import {
  useAccount,
  useDisconnect,
  useNetwork,
} from "wagmi";

const useHeader = () => {
  const { disconnect } = useDisconnect();
  const { address: wagmiAddress } = useAccount();
  const { chain } = useNetwork();
  const [isSupportedNetwork, setIsSupportedNetwork] = React.useState(false);
  const [address, setAddress] = useState<any>();
  useEffect(() => {
    setAddress(wagmiAddress);
  }, [wagmiAddress]);

  useEffect(() => {
    const isSupportedNetwork = chain?.network === "maticmum";
    setIsSupportedNetwork(isSupportedNetwork);
  }, [chain]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = () => {
    disconnect();
    handleCloseUserMenu();
  };

  const settings = [
    {
      title: "Jobs",
      action: undefined,
      href: "/jobs/list",
    },
    {
      title: "Sign Out",
      action: signOut,
    },
  ];

  return {
    address,
    settings,
    handleOpenUserMenu,
    handleCloseUserMenu,
    anchorElUser,
    isSupportedNetwork,
  };
};

export const Header = () => {
  const classes = useGlobalClasses();
  const {
    settings,
    handleOpenUserMenu,
    handleCloseUserMenu,
    anchorElUser,
    address,
    isSupportedNetwork,
  } = useHeader();

  const renderAvatar = () => {
    if (!address) {
      return null;
    }
    return (
      <>
        <Typography className={`${classes.whiteFont} ${classes.mr2}`}>
          {address}
        </Typography>
        <Avatar alt={address} src={makeBlockie(address)} />
      </>
    );
  };

  const renderMenuLink = (setting: any, children: any) => {
    if (!setting.href) {
      return children;
    }
    return <Link href={setting.href}>{children}</Link>;
  };

  const renderNetworkError = () => {
    if (isSupportedNetwork) {
      return null;
    }
    return (
      <Typography variant="h5">
        Please switch to Polygon Mumbai testnet
      </Typography>
    );
  };
  return (
    <AppBar position="static">
      <Container className={classes.header}>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Umpire
        </Typography>
        {renderNetworkError()}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {renderAvatar()}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => {
              const { action, title } = setting;
              return (
                <MenuItem key={title} onClick={action}>
                  {renderMenuLink(
                    setting,
                    <Typography textAlign="center">{title}</Typography>
                  )}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
};

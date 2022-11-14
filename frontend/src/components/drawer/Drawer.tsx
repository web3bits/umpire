
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import { useGlobalContext } from "../../context/GlobalContext";
import { Logo } from "../Logo";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import makeBlockie from "ethereum-blockies-base64";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WorkIcon from "@mui/icons-material/Work";

const useStyles: any = makeStyles((theme: any) => ({
  colorWhite: {
    color: "#fff",
  },
  hr: {
    backgroundImage:
      "linear-gradient(90deg,hsla(0,0%,100%,0),#fff,hsla(0,0%,100%,0))",
    marginBottom: "0.5rem",
    height: "1px",
    opacity: ".25",
  },
  header: {
    padding: "1.5rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItem: {
    padding: "0px",
    width: "87%",
    margin: "0 auto",
    marginBottom: "5px",
    borderRadius: "7px",
    "&:hover": {
      backgroundColor: "hsla(0,0%,78%,.2)",
    },
    "& .MuiTypography-root": {
      fontWeight: "100",
      fontSize: "0.9rem",
      lineHeight: "1.5",
    },
  },
  steps: {
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  active: {
    backgroundImage: "linear-gradient(195deg,#66bb6a,#43a047)",
  },
  link: {
    textDecoration: "none",
    width: "100%",
  },
  text: {
    fontWeight: "100!important",
    fontSize: "1rem",
    lineHeight: "1.5",
  },
}));

const useDrawer = () => {
  const { user, setUser, setLoading } = useGlobalContext();
  const { address } = user ?? {};

  const signOut = () => {
    setUser(undefined);
  };

  const settings = [
    {
      title: "Create new job",
      action: undefined,
      href: "/jobs/create/step1",
      icon: <AddCircleIcon />,
    },
    {
      title: "Jobs",
      action: undefined,
      href: "/jobs/list",
      icon: <WorkIcon />,
    },
    {
      title: "Sign Out",
      action: signOut,
      icon: <LogoutIcon />,
    },
  ];

  const steps = [
    {
      title: "Step 1",
      href: "/jobs/create/step1",
    },
    {
      title: "Step 2",
      href: "/jobs/create/step2",
    },
    {
      title: "Step 3",
      href: "/jobs/create/step3",
    },
    {
      title: "Step 4",
      href: "/jobs/create/step4",
    },
  ];

  return {
    address: address ?? null,
    settings,
    steps,
  };
};

export const Drawer = () => {
  const router = useRouter();
  const classes = useStyles();
  const { address, settings, steps } = useDrawer();

  const renderAvatar = () => {
    if (!address) {
      return <Avatar />;
    }
    return (
      <Avatar
        className={classes.avatar}
        alt={address}
        src={makeBlockie(address)}
      />
    );
  };

  const renderMenuLink = (setting: any, children: any) => {
    if (!setting.href) {
      return children;
    }
    return (
      <Link
        className={classes.link}
        href={setting.href}>
        {children}
      </Link>
    );
  };

  const drawer = (
    <>
      <div className={classes.header}>
        {renderAvatar()}
        <Logo />
      </div>
      <div className={classes.hr}></div>
      <div>
        <List>
          {steps.map((step, index) => (
            <ListItem
              key={index}
              className={classes.listItem + " " + classes.steps}
              // selected={router.asPath === step.href ? true : false}
              // classes={{ selected: classes.active }}
            >
              <ListItemIcon className={classes.colorWhite}>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText primary={step.title} />
            </ListItem>
          ))}
        </List>
        <div className={classes.hr}></div>
        <List>
          {settings.map((setting) => {
            const { action, title, icon, href } = setting;
            return (
              <ListItem
                key={title}
                onClick={action}
                className={classes.listItem}
                selected={router.asPath === href ? true : false}
                classes={{ selected: classes.active }}>
                {renderMenuLink(
                  setting,
                  <ListItemButton className={classes.colorWhite}>
                    <ListItemIcon className={classes.colorWhite}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={title}
                      className={classes.text}
                    />
                  </ListItemButton>
                )}
              </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );

  return <>{drawer}</>;
};

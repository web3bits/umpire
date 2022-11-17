
import * as React from "react";
import { useEffect, useState } from "react";
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
import UmpireStepper from "../ui/UmpireStepper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";
import { STEPS, STEP_NAVIGATION, STEPS_TITLE } from "../../constants";

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
    justifyContent: "center",
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
    // backgroundImage: "linear-gradient(195deg,#66bb6a,#43a047)",
    backgroundImage: "linear-gradient(195deg,#ec407a,#d81b60)",
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
  const { disconnect } = useDisconnect();
   const { address: wagmiAddress } = useAccount();
  const { data: wagmiEnsAvatar } = useEnsAvatar({
    addressOrName: wagmiAddress,
  });
  const { data: wagmiEnsName } = useEnsName({ address: wagmiAddress });
  const { chain } = useNetwork();
  const [ensName, setEnsName] = useState<any>();
  const [ensAvatar, setEnsAvatar] = useState<any>();
  const [isSupportedNetwork, setIsSupportedNetwork] = React.useState(false);
  const [address, setAddress] = useState<any>();
  useEffect(() => {
    setAddress(wagmiAddress);
  }, [wagmiAddress]);

  useEffect(() => {
    const isSupportedNetwork = chain?.network === "goerli";
    setIsSupportedNetwork(isSupportedNetwork);
  }, [chain]);

  useEffect(() => {
    setEnsAvatar(wagmiEnsAvatar);
  }, [wagmiEnsAvatar]);

  useEffect(() => {
    setEnsName(wagmiEnsName);
  }, [wagmiEnsName]);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const signOut = () => {
    disconnect();
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
  const { setCreateJobStepNumber, createJobStepNumber } = useGlobalContext();
  const router = useRouter();
  const classes = useStyles();
  const {  settings,
    anchorElUser,
    address,
    ensAvatar,
    ensName,
    isSupportedNetwork, steps } = useDrawer();
    const stepNumber = 0;

  const renderAvatar = () => {
    if (!address) {
      return <Avatar/>;
    }
    return (
      <>
        {/* <Typography className={`${classes.whiteFont} ${classes.mr2}`}>
          {ensName ? `${ensName} (${address})` : address}
        </Typography> */}
        <Avatar alt={address} src={ensAvatar ?? makeBlockie(address)} />
      </>
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

  const renderNetworkError = () => {
    if (isSupportedNetwork) {
      return null;
    }
    return (
      <Typography variant="h5">Please switch to Goerli testnet</Typography>
    );
  };

  const indexs = STEP_NAVIGATION.map(i => i.includes(router.asPath));
  const stepNo = indexs?.indexOf(true);

  const drawer = (
    <>
      <div className={classes.header}>
        <Logo />
      </div>
      <div className={classes.header}>{renderAvatar()}</div>
      <div className={classes.hr}></div>
      <div>
        {/* <List>
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
        </List> */}
        <div className={classes.stepper}>
        <UmpireStepper
          stepNumber={stepNo}
          steps={STEPS_TITLE}
          setStepNumber={setCreateJobStepNumber}
          stepNavigation={STEP_NAVIGATION}
        />
        </div>
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

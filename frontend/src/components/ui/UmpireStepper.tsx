import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

interface IUmpireStepper {
  steps: string[];
  stepNumber: number;
  stepNavigation: string[];
  setStepNumber: (stepNumber: number) => void;
}

const useStyles: any = makeStyles((theme: any) => ({
    stepper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    height: "170px",
    margin: "22px 0px 22px 24px",
    color: "#fff",
  }

}));
const UmpireStepper = ({
  steps,
  stepNumber,
  setStepNumber,
  stepNavigation,
}: IUmpireStepper) => {
   const classes = useStyles();
  const router = useRouter();
  const handleNext = () => {
    router.push(stepNavigation[stepNumber]);
  };

  const handleBack = () => {
    setStepNumber(stepNumber - 1);
  };

  const handleReset = () => {
    setStepNumber(0);
  };



  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={stepNumber} className={classes.stepper}>
        {steps?.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
export default UmpireStepper;

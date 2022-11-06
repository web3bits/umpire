import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../../components/Layout";
import UmpireStepper from "../../../components/ui/UmpireStepper";
import { STEPS, STEP_NAVIGATION } from "../../../constants";
import { EComparator, useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import { EditFormula } from "./EditFormula";
import { ItemsSelected } from "./ItemsSelected";

const useCreateJobStep3 = () => {
  const [currentFormulaOperator, setCurrentFormulaOperator] =
    useState<EComparator>(EComparator.EQUAL);
  const router = useRouter();
  const { setCreateJobStepNumber, createJob } = useGlobalContext();
  const { valuesFrom, valuesTo } = createJob ?? {};
  const nextStep = () => {
    setCreateJobStepNumber(3);
    router.push("/jobs/create/step4");
  };
  const handleOperatorChange = (event: any) => {
    setCurrentFormulaOperator(event.target.value);
  };
  return {
    setCreateJobStepNumber,
    nextStep,
    valuesFrom,
    valuesTo,
    handleOperatorChange,
    currentFormulaOperator,
  };
};

const CreateJobStep3 = () => {
  const classes = useGlobalClasses();
  const {
    setCreateJobStepNumber,
    nextStep,
    valuesFrom,
    valuesTo,
    handleOperatorChange,
    currentFormulaOperator,
  } = useCreateJobStep3();
  return (
    <Layout>
      <Box className={classes.centeredRow}>
        <UmpireStepper
          stepNumber={2}
          steps={STEPS}
          setStepNumber={setCreateJobStepNumber}
          stepNavigation={STEP_NAVIGATION}
        />
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 3 - define formula</Typography>
      </Box>
      <Box className={`${classes.centeredRow} ${classes.mt2}`}>
        <Typography variant="h5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </Typography>
      </Box>
      <Box className={classes.row}>
        <Typography variant="h6">
          List of variables you have selected
          <ItemsSelected
            leftSideValuesSelected={valuesFrom ?? []}
            rightSideValuesSelected={valuesTo ?? []}
          />
        </Typography>
      </Box>
      <EditFormula
        handleOperatorChange={handleOperatorChange}
        currentFormulaOperator={currentFormulaOperator}
      />
      <Box className={classes.centeredRow}>
        <Button variant="outlined" color="primary" onClick={nextStep}>
          Next Step
        </Button>
      </Box>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  console.log("Get server side props");
  return {
    props: { user: session?.user ?? null },
  };
}

export default CreateJobStep3;

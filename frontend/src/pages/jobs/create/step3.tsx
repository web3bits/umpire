import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../../components/Layout";
import UmpireStepper from "../../../components/ui/UmpireStepper";
import { STEPS, STEP_NAVIGATION } from "../../../constants";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import EditFormula, { IFormula } from "./EditFormula";
import ItemsSelected from "./ItemsSelected";

const useCreateJobStep3 = () => {
  const router = useRouter();
  const { setCreateJobStepNumber, createJob, setCreateJob } =
    useGlobalContext();
  const { values } = createJob ?? {
    values: [],
  };
  const [formula, setFormula] = useState<string>("");

  const nextStep = () => {
    setCreateJobStepNumber(3);
    router.push("/jobs/create/step4");
  };

  const replaceValues = (formula: string, items: string[]) => {
    let finalValue = "";
    let newFormula = formula;
    const chunks = formula.split("]");
    for (const chunk of chunks) {
      const squareBracketIndex = chunk.indexOf("[");
      if (squareBracketIndex > -1) {
        const value = chunk.substring(squareBracketIndex + 1, chunk.length);
        finalValue = items[parseInt(value) - 1];
        newFormula = newFormula.replace(`[${value}]`, `[${finalValue}]`);
      }
    }
    return newFormula;
  };

  const handleSetFormula = (formula: IFormula) => {
    const { leftSide, rightSide, operator } = formula;
    if (!values) {
      return;
    }
    try {
      const leftValue = replaceValues(leftSide, values);
      const rightValue = replaceValues(rightSide, values);
      setFormula(`${leftValue} ${operator} ${rightValue}`);
      setCreateJob({
        ...createJob,
        leftSide: leftValue,
        comparator: operator,
        rightSide: rightValue,
      });
    } catch (err: any) {}
  };
  return {
    setCreateJobStepNumber,
    nextStep,
    values,
    formula,
    setFormula: handleSetFormula,
  };
};

const CreateJobStep3 = () => {
  const classes = useGlobalClasses();
  const { setCreateJobStepNumber, nextStep, values, formula, setFormula } =
    useCreateJobStep3();
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
          <ItemsSelected selectedValues={values ?? []} />
        </Typography>
      </Box>
      <EditFormula setFormula={setFormula} values={values ?? []} />
      <Box className={classes.row}>
        <Typography variant="h6">Formula Typed</Typography>
      </Box>
      <Box className={classes.row}>
        <Typography variant="body1">{formula}</Typography>
      </Box>
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

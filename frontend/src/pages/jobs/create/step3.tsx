import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../../components/Layout";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import EditFormula, { IFormula } from "./EditFormula";
import ItemsSelected from "./ItemsSelected";
import { Alert } from "@mui/material";
import { UmpireVariable } from "../../../utils/model";

const useCreateJobStep3 = () => {
  const router = useRouter();
  const { createJob, setCreateJob } = useGlobalContext();
  const { variableFeeds } = createJob ?? {
    variableFeeds: [],
  };
  const [formula, setFormula] = useState<string>("");
  const [errorInFormula, setErrorInFormula] = useState(false);

  const nextStep = () => {
    router.push("/jobs/create/step4");
  };

  const replaceValues = (formula: string, items: UmpireVariable[]) => {
    let finalValue = "";
    let newFormula = formula;
    const chunks = formula.split("]");
    for (const chunk of chunks) {
      const squareBracketIndex = chunk.indexOf("[");
      if (squareBracketIndex > -1) {
        const value = chunk.substring(squareBracketIndex + 1, chunk.length);
        finalValue = items[parseInt(value) - 1].id;
        newFormula = newFormula.replace(`[${value}]`, `[${finalValue}]`);
      }
    }
    return newFormula;
  };

  const handleSetFormula = (formula: IFormula) => {
    const { leftFormula, rightFormula, operator } = formula;
    if (!variableFeeds) {
      return;
    }
    try {
      const leftValue = replaceValues(leftFormula, variableFeeds);
      const rightValue = replaceValues(rightFormula, variableFeeds);
      setFormula(`${leftValue} ${operator} ${rightValue}`);
      setCreateJob({
        ...createJob,
        leftFormula: leftValue,
        comparator: operator,
        rightFormula: rightValue,
      });
    } catch (err: any) {}
  };
  return {
    nextStep,
    variableFeeds,
    formula,
    setFormula: handleSetFormula,
    setErrorInFormula,
    errorInFormula,
  };
};

const CreateJobStep3 = () => {
  const classes = useGlobalClasses();
  const {
    nextStep,
    variableFeeds,
    formula,
    setFormula,
    setErrorInFormula,
    errorInFormula,
  } = useCreateJobStep3();
  return (
    <Layout>
      <Box className={`${classes.centeredRow} ${classes.mt3}`}>
        <Typography variant="h4">Step 3 - define formula</Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          Now for the fun part! Below you can define a formula, a condition
          which is going to be evaluated to determine when to finalize your job.
          In this MVP the formula is defined as a simple comparison, in the
          future we'll support a more complex evaluation engine similar to Excel
          formulas.
        </Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body1">
          Feel free to use integers, real numbers, arithmetic operators and
          variables selected in the previous step. To insert a variable, press{" "}
          <strong>\</strong> key and select your variable.
        </Typography>
      </Box>
      <Box className={`${classes.mt2} ${classes.px6}`}>
        <Typography variant="body2">
          List of variables you may use in your formula:
          <ItemsSelected variableFeeds={variableFeeds ?? []} />
        </Typography>
      </Box>
      <EditFormula
        setFormula={setFormula}
        setErrorInFormula={setErrorInFormula}
        variableFeeds={variableFeeds ?? []}
      />
      <Box className={classes.row}>
        <Typography variant="h6">Formula Typed</Typography>
      </Box>
      <Box className={classes.row}>
        <Typography variant="body1">{formula}</Typography>
      </Box>
      <Box className={`${classes.row} ${classes.mt2}`}>
        {errorInFormula && (
          <Alert severity="warning" sx={{ borderRadius: "0.75rem" }}>
            The formula typed is not valid, please fix it.
          </Alert>
        )}
      </Box>
      <Box className={classes.centeredRow}>
        <Button onClick={nextStep} disabled={errorInFormula} className="pink">
          Next Step
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep3;

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
const useCreateJobStep3 = () => {
  const router = useRouter();
  const { createJob, setCreateJob } =
    useGlobalContext();
  const { values } = createJob ?? {
    values: [],
  };
  const [formula, setFormula] = useState<string>("");
  const [errorInFormula, setErrorInFormula] = useState(false);

  const nextStep = () => {
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
    nextStep,
    values,
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
    values,
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
      <EditFormula
        setFormula={setFormula}
        setErrorInFormula={setErrorInFormula}
        values={values ?? []}
      />
      <Box className={classes.row}>
        <Typography variant="h6">Formula Typed</Typography>
      </Box>
      <Box className={classes.row}>
        <Typography variant="body1">{formula}</Typography>
      </Box>
      <Box className={`${classes.row} ${classes.mt2}`}>
        {errorInFormula && (
          <Alert severity="warning" sx={{borderRadius: "0.75rem"}}>
            The formula typed is not valid, please fix it.
          </Alert>
        )}
      </Box>
      <Box className={classes.centeredRow}>
        <Button
          onClick={nextStep}
          disabled={errorInFormula}
          className="pink"
        >
          Next Step
        </Button>
      </Box>
    </Layout>
  );
};

export default CreateJobStep3;

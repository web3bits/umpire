import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { EComparator } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";
import FormulaTextField from "./FormulaTextField";
import { debounce } from "lodash";
import { UmpireVariable } from "../../../utils/model";

export interface IFormula {
  leftFormula: string;
  operator: EComparator;
  rightFormula: string;
}

const useEditFormula = (
  handleFormulaCompleted: (formula: IFormula) => void,
  setErrorInFormula: (errorInFormula: boolean) => void,
  itemsCount: number
) => {
  const [leftFormula, setLeftFormula] = useState<string>("");
  const [rightFormula, setRightFormula] = useState<string>("");
  const [comparator, setComparator] = useState<EComparator | null>(null);
  const [debouncedTimer, setDebouncedTimer] = useState<any>(undefined);

  const isNumber = (element: string) => {
    try {
      const number = parseInt(element, 10);
      return Number.isInteger(number);
    } catch (err: any) {
      return false;
    }
  };

  const isValidFormula = (length: number, formula: string) => {
    const regExpr = new RegExp(/^\[\d+\]$/);

    let valid = true;
    const plainFormula = formula
      .replace(/ /g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\+/g, "_")
      .replace(/\-/g, "_")
      .replace(/\*/g, "_")
      .replace(/\//g, "_")
      .replace(/\^/g, "_");
    const fields = plainFormula.split("_");
    fields.forEach((field: string) => {
      const matchesRegExpr = regExpr.test(field);
      if (!isNumber(field) && !matchesRegExpr) {
        console.log(`${field} is not supported`);
        valid = false;
      } else if (matchesRegExpr) {
        const plainValue = field.replace(/\[/g, "").replace(/\]/g, "");
        if (
          !isNumber(plainValue) ||
          parseInt(plainValue) < 1 ||
          parseInt(plainValue) > length + 1
        ) {
          console.log(
            `${field} matches the regexpr but it is not a number or it is a higher index`
          );
          valid = false;
        }
      }
    });
    return valid;
  };

  const isFormulaComplete = () => {
    if (debouncedTimer) {
      debouncedTimer.cancel();
    }
    const debounceTimer = debounce(() => {
      const errorInFormula =
        leftFormula.trim().length === 0 ||
        rightFormula.trim().length === 0 ||
        !comparator ||
        comparator.length === 0;
      if (errorInFormula) {
        setErrorInFormula(true);
      } else {
        handleFormulaCompleted({
          leftFormula,
          operator: comparator,
          rightFormula,
        });
        setErrorInFormula(false);
      }
    }, 1000);
    setDebouncedTimer(debounceTimer);
  };

  const handleLeftFormulaChange = (event: any) => {
    const { value } = event.target;
    setLeftFormula(value);
  };

  const handleRightFormulaChange = (event: any) => {
    const { value } = event.target;
    setRightFormula(value);
  };

  const handleComparatorChange = (event: any) => {
    const { value } = event.target;
    setComparator(value);
  };

  useEffect(() => {
    isFormulaComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftFormula, rightFormula, comparator]);

  return {
    handleLeftFormulaChange,
    handleRightFormulaChange,
    handleComparatorChange,
    comparator,
    leftFormula,
    rightFormula,
  };
};

const renderRadioGroup = (
  handleOperatorChange: (event: any) => void,
  currentFormulaOperator: string | null
) => {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="formula-radio-buttons-group-label"
        name="radio-buttons-group"
        defaultValue={""}
        onChange={handleOperatorChange}
        value={currentFormulaOperator}
        sx={{
          "& .MuiSvgIcon-root": { color: "#ec407a" },
        }}>
        <FormControlLabel
          value={EComparator.EQUAL}
          control={<Radio disableRipple />}
          label={EComparator.EQUAL}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN}
          control={<Radio disableRipple />}
          label={EComparator.GREATER_THAN}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN_EQUAL}
          control={<Radio disableRipple />}
          label={EComparator.GREATER_THAN_EQUAL}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN}
          control={<Radio disableRipple />}
          label={EComparator.LOWER_THAN}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN_EQUAL}
          control={<Radio disableRipple />}
          label={EComparator.LOWER_THAN_EQUAL}
        />
        <FormControlLabel
          value={EComparator.DIFFERENT_FROM}
          control={<Radio disableRipple />}
          label={EComparator.DIFFERENT_FROM}
        />
      </RadioGroup>
    </FormControl>
  );
};
const EditFormula = ({
  variableFeeds,
  setErrorInFormula,
  setFormula,
}: {
  variableFeeds: UmpireVariable[];
  setErrorInFormula: (errorInFormula: boolean) => void;
  setFormula: (formula: IFormula) => void;
}) => {
  const classes = useGlobalClasses();
  const {
    handleLeftFormulaChange,
    handleRightFormulaChange,
    handleComparatorChange,
    comparator,
    leftFormula,
    rightFormula,
  } = useEditFormula(setFormula, setErrorInFormula, variableFeeds?.length ?? 0);
  return (
    <Box className={`${classes.container} ${classes.mt3}`}>
      <Box className={classes.centeredRow}>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <Typography variant="body1">Left side</Typography>
        </Box>
        <Box style={{ flex: 1, textAlign: "center" }}>
          <Typography variant="body1">Comparator</Typography>
        </Box>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <Typography variant="body1">Right side</Typography>
        </Box>
      </Box>
      <Box className={classes.centeredRow}>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <FormulaTextField
            id="formula-left-side"
            handleOnChange={handleLeftFormulaChange}
            variableFeeds={variableFeeds}
          />
        </Box>
        <Box style={{ flex: 1, textAlign: "center" }}>
          {renderRadioGroup(handleComparatorChange, comparator)}
        </Box>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <FormulaTextField
            id="formula-rightt-side"
            handleOnChange={handleRightFormulaChange}
            variableFeeds={variableFeeds}
          />
        </Box>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Box>
  );
};

export default EditFormula;

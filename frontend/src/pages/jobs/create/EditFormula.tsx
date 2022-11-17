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

export interface IFormula {
  leftSide: string;
  operator: EComparator;
  rightSide: string;
}
const useEditFormula = (
  handleFormulaCompleted: (formula: IFormula) => void,
  setErrorInFormula: (errorInFormula: boolean) => void,
  itemsCount: number
) => {
  const [leftSide, setLeftSide] = useState<string>("");
  const [rightSide, setRightSide] = useState<string>("");
  const [operator, setOperator] = useState<EComparator | null>(null);
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
      if (
        leftSide.trim().length === 0 ||
        rightSide.trim().length === 0 ||
        !operator ||
        operator.length === 0 ||
        !isValidFormula(itemsCount, leftSide) ||
        !isValidFormula(itemsCount, rightSide)
      ) {
        setErrorInFormula(true);
      } else {
        handleFormulaCompleted({ leftSide, operator, rightSide });
        setErrorInFormula(false);
      }
    }, 2000);
    setDebouncedTimer(debounceTimer);
  };

  const handleLeftSideChange = (event: any) => {
    const { value } = event.target;
    setLeftSide(value);
  };

  const handleRightSideChange = (event: any) => {
    const { value } = event.target;
    setRightSide(value);
  };

  const handleOperatorChange = (event: any) => {
    const { value } = event.target;
    setOperator(value);
  };

  useEffect(() => {
    isFormulaComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSide, rightSide, operator]);
  return {
    handleLeftSideChange,
    handleRightSideChange,
    handleOperatorChange,
    operator,
    leftSide,
    rightSide,
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
      >
        <FormControlLabel
          value={EComparator.EQUAL}
          control={<Radio />}
          label={EComparator.EQUAL}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN}
          control={<Radio />}
          label={EComparator.GREATER_THAN}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN_EQUAL}
          control={<Radio />}
          label={EComparator.GREATER_THAN_EQUAL}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN}
          control={<Radio />}
          label={EComparator.LOWER_THAN}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN_EQUAL}
          control={<Radio />}
          label={EComparator.LOWER_THAN_EQUAL}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
        <FormControlLabel
          value={EComparator.DIFFERENT_FROM}
          control={<Radio />}
          label={EComparator.DIFFERENT_FROM}
          sx={{ '& .MuiSvgIcon-root': { color: "#ec407a" }}}
        />
      </RadioGroup>
    </FormControl>
  );
};
const EditFormula = ({
  values,
  setErrorInFormula,
  setFormula,
}: {
  values: string[];
  setErrorInFormula: (errorInFormula: boolean) => void;
  setFormula: (formula: IFormula) => void;
}) => {
  const classes = useGlobalClasses();
  const {
    handleLeftSideChange,
    handleRightSideChange,
    handleOperatorChange,
    operator,
    leftSide,
    rightSide,
  } = useEditFormula(setFormula, setErrorInFormula, values?.length ?? 0);
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
            handleOnChange={handleLeftSideChange}
            values={values}
          />
        </Box>
        <Box style={{ flex: 1, textAlign: "center" }}>
          {renderRadioGroup(handleOperatorChange, operator)}
        </Box>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <FormulaTextField
            id="formula-rightt-side"
            handleOnChange={handleRightSideChange}
            values={values}
          />
        </Box>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Box>
  );
};

export default EditFormula;

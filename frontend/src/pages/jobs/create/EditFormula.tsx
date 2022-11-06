import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { EComparator } from "../../../context/GlobalContext";
import { useGlobalClasses } from "../../../theme";

const renderRadioGroup = (
  handleOperatorChange: (event: any) => void,
  currentFormulaOperator: string
) => {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="formula-radio-buttons-group-label"
        defaultValue={EComparator.DIFFERENT_FROM}
        name="radio-buttons-group"
        onChange={handleOperatorChange}
        value={currentFormulaOperator}
      >
        <FormControlLabel
          value={EComparator.EQUAL}
          control={<Radio />}
          label={EComparator.EQUAL}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN}
          control={<Radio />}
          label={EComparator.GREATER_THAN}
        />
        <FormControlLabel
          value={EComparator.GREATER_THAN_EQUAL}
          control={<Radio />}
          label={EComparator.GREATER_THAN_EQUAL}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN}
          control={<Radio />}
          label={EComparator.LOWER_THAN}
        />
        <FormControlLabel
          value={EComparator.LOWER_THAN_EQUAL}
          control={<Radio />}
          label={EComparator.LOWER_THAN_EQUAL}
        />
        <FormControlLabel
          value={EComparator.DIFFERENT_FROM}
          control={<Radio />}
          label={EComparator.DIFFERENT_FROM}
        />
      </RadioGroup>
    </FormControl>
  );
};
const EditFormula = ({
  handleOperatorChange,
  currentFormulaOperator,
}: {
  handleOperatorChange: (event: any) => void;
  currentFormulaOperator: string;
}) => {
  const classes = useGlobalClasses();
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
          <TextField id="formula-left-side" label="" variant="outlined" />
        </Box>
        <Box style={{ flex: 1, textAlign: "center" }}>
          {renderRadioGroup(handleOperatorChange, currentFormulaOperator)}
        </Box>
        <Box style={{ flex: 2, textAlign: "center" }}>
          <TextField id="formula-right-side" label="" variant="outlined" />
        </Box>
      </Box>
      <Box className={classes.centeredRow}></Box>
    </Box>
  );
};

export default EditFormula;

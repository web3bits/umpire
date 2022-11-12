import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../theme";

const UmpireDetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const classes = useGlobalClasses();
  return (
    <Box className={`${classes.centeredRow} ${classes.mt2}`}>
      <Box style={{ flex: 1 }}>
        <Typography variant="body1" component="b" className={classes.bold}>
          {label}
        </Typography>
      </Box>
      <Box style={{ flex: 2 }}>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
};
export default UmpireDetailRow;

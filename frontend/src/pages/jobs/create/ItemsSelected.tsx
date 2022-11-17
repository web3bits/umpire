import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
const ItemsSelected = ({
  selectedValues,
  selectable = false,
}: {
  selectedValues: string[];
  selectable: boolean;
}) => {
  const classes = useGlobalClasses();
  const renderSelectButton = () => {
    if (!selectable) {
      return null;
    }
    return (
      <Button variant="contained" color="primary" className={classes.ml2}>
        <AddIcon />
      </Button>
    );
  };
  const renderItem = (leftItem: string, index: number) => {
    return (
      <Box className={classes.flexRow}>
        <Typography variant="body1" className={classes.variableValue}>
          {index + 1}. {leftItem}
        </Typography>
        {renderSelectButton()}
      </Box>
    );
  };
  const renderItems = () => {
    return selectedValues?.map((item: string, index: number) =>
      renderItem(item, index)
    );
  };
  return <>{renderItems()}</>;
};
export default ItemsSelected;

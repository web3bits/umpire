import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
const ItemsSelected = ({ selectedValues }: { selectedValues: string[] }) => {
  const classes = useGlobalClasses();

  const renderItem = (leftItem: string, index: number) => {
    return (
      <Box className={classes.flexRow}>
        <Typography
          variant="body1"
          className={classes.variableValue}>
          {index + 1}. {leftItem}
        </Typography>
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

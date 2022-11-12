import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../../theme";

const ItemsSelected = ({ selectedValues }: { selectedValues: string[] }) => {
  const classes = useGlobalClasses();
  const renderItem = (leftItem: string, index: number) => {
    return (
      <Box className={classes.row}>
        <Typography variant="body1">
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

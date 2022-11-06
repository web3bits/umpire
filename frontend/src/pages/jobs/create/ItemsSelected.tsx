import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../../theme";

const ItemsSelected = ({
  leftSideValuesSelected,
  rightSideValuesSelected,
}: {
  leftSideValuesSelected: string[];
  rightSideValuesSelected: string[];
}) => {
  const classes = useGlobalClasses();
  const renderItem = (leftItem: string, rightItem: string, index: number) => {
    return (
      <Box className={classes.row}>
        <Typography variant="body1">
          {index + 1}. {leftItem} - {rightItem}
        </Typography>
      </Box>
    );
  };
  const renderItems = () => {
    return leftSideValuesSelected?.map((leftItem: string, index: number) => {
      const rightItem =
        rightSideValuesSelected.length > index
          ? rightSideValuesSelected[index]
          : "";
      return renderItem(leftItem, rightItem, index);
    });
  };
  return <>{renderItems()}</>;
};
export default ItemsSelected;

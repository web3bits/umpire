import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useGlobalClasses } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import { UmpireVariable } from "../../../utils/model";

const ItemsSelected = ({
  variableFeeds,
}: {
  variableFeeds: UmpireVariable[];
}) => {
  const classes = useGlobalClasses();

  const renderItem = (leftItem: UmpireVariable, index: number) => {
    return (
      <Box key={index}>
        <Typography variant="body2" className={classes.variableValue}>
          {index + 1}. {leftItem.id}
        </Typography>
      </Box>
    );
  };
  const renderItems = () => {
    return variableFeeds?.map((item: UmpireVariable, index: number) =>
      renderItem(item, index)
    );
  };
  return <>{renderItems()}</>;
};
export default ItemsSelected;

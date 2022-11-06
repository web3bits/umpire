import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

interface IListItem {
  id: string;
  title: string;
  type: string;
  address: string;
}
export const UmpireList = ({
  listId,
  listItems,
  setOptionsSelected,
  selected,
  disabled,
}: {
  listId: string;
  listItems: IListItem[];
  setOptionsSelected: (selected: string[]) => void;
  selected: string[];
  disabled: boolean;
}) => {
  const handleToggle = (value: string) => () => {
    const currentIndex = selected.indexOf(value);
    const newChecked = [...selected];
    if (currentIndex === -1 && !disabled) {
      newChecked.push(value);
    }
    if (currentIndex > -1) {
      newChecked.splice(currentIndex, 1);
    }
    setOptionsSelected(newChecked);
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        maxHeight: 500,
        overflowY: "scroll",
      }}
    >
      {listItems.map((listItem: IListItem) => {
        const { id } = listItem;
        const labelId = `${listId}-list-label-${id}`;

        return (
          <ListItem key={labelId} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selected.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={id} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

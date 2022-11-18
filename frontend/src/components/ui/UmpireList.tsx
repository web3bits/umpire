import * as React from "react";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Box, TextField } from "@mui/material";
import { useGlobalClasses } from "../../theme";
import { UmpireVariable } from "../../utils/model";

interface IListItem {
  id: string;
  title: string;
  type: string;
  address: string;
}

const useUmpireList = (items: IListItem[]) => {
  const [listItems, setListItems] = useState(items);
  const [filteredListItems, setFilteredListItems] =
    useState<IListItem[]>(items);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    setListItems(items);
    setFilteredListItems(items);
  }, [items]);
  const quickSearch = (event: any) => {
    const { value } = event.target;
    setFilter(value);
    if (value.trim().length === 0) {
      setFilteredListItems(listItems);
      return;
    }
    const lowerCaseValue = value.toLowerCase().replace(/ /g, "");
    const filteredListItems = listItems.filter(
      (item: IListItem) =>
        item.id.toLowerCase().replace(/ /g, "").indexOf(lowerCaseValue) > -1
    );
    setFilteredListItems(filteredListItems);
  };

  return {
    filteredListItems,
    quickSearch,
    filter,
  };
};

export const UmpireList = ({
  listId,
  listItems,
  setOptionsSelected,
  selected,
  disabled,
}: {
  listId: string;
  listItems: IListItem[];
  setOptionsSelected: (selected: UmpireVariable[]) => void;
  selected: UmpireVariable[];
  disabled: boolean;
}) => {
  const { filteredListItems, filter, quickSearch } = useUmpireList(listItems);
  const handleToggle = (variableId: string) => () => {
    const variable = listItems.find((item) => item.id === variableId);
    const currentIndex = selected.findIndex((item) => item.id === variableId);
    const newChecked = [...selected];
    if (currentIndex === -1 && !disabled) {
      newChecked.push(variable!);
    }
    if (currentIndex > -1) {
      newChecked.splice(currentIndex, 1);
    }
    setOptionsSelected(newChecked);
  };

  const classes = useGlobalClasses();
  return (
    <Box className={`${classes.mt2} ${classes.fullWidth}`}>
      <Box>
        <TextField
          label="Quick Search"
          onChange={quickSearch}
          value={filter}
          className={classes.inputField}
        />
      </Box>
      <Box className={classes.mt2}>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            maxHeight: 500,
            overflowY: "scroll",
          }}
        >
          {filteredListItems.map((listItem: IListItem) => {
            const { id } = listItem;
            const labelId = `${listId}-list-label-${id}`;

            return (
              <ListItem key={labelId} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        selected.findIndex((item) => item.id === id) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: "#ec407a",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={id} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

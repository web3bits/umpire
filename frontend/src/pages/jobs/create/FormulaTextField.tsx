import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useGlobalClasses } from "../../../theme";

const FormulaList = ({
  values,
  handleItemClick,
}: {
  values: string[];
  handleItemClick: (event: any) => void;
}) => {
  const classes = useGlobalClasses();
  const renderItem = (value: string) => {
    return (
      <Box
        className={classes.formulaListValue}
        onClick={handleItemClick}
        data-id={value}
      >
        <span className={classes.formulaValue}>{value}</span>
      </Box>
    );
  };
  const renderItems = () => {
    return values?.map((value: string) => {
      return renderItem(value);
    });
  };
  return <Box className={classes.formulaList}>{renderItems()}</Box>;
};

const useFormulaTextField = (
  id: string,
  handleOnChange: (event: any) => void
) => {
  const [value, setValue] = useState("");
  const [displayList, setDisplayList] = useState(false);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSelectionEnd = () => {
    const selectionEnd =
      (document.getElementById(id) as any)?.selectionEnd! ?? 0;
    setSelectionEnd(selectionEnd);
  };
  useEffect(() => {
    handleSelectionEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleKeyUp = (event: any) => {
    if (event.which === 37) {
      setSelectionEnd((selectionEnd) =>
        selectionEnd > 0 ? selectionEnd - 1 : 0
      );
      return;
    }

    if (event.which === 39) {
      setSelectionEnd((selectionEnd) =>
        selectionEnd < value?.length ? selectionEnd + 1 : value.length
      );
      return;
    }
  };

  const handleKeyDown = (event: any) => {
    console.log(event.which);
    switch (event.which) {
      case 8:
      case 37:
      case 39:
      case 46:
        return false;
      case 32:
        event.preventDefault();
        return false;
      case 220:
        if (canInsertVariable()) {
          setDisplayList(true);
        }
        event.preventDefault();
        return false;
      case 57: // (
        if (!isValidOpenBracket()) {
          event.preventDefault();
          return false;
        }
        break;
      case 48:
        if (event.key === "0") {
          if (!isValidNumber()) {
            event.preventDefault();
            return false;
          }
          return;
        }
        if (!isValidClosingBracket()) {
          event.preventDefault();
          return false;
        }
        break;
      case 56:
        if (event.key === "*") {
          if (!isValidOperator()) {
            event.preventDefault();
            return false;
          }
          return;
        }
        if (!isValidNumber()) {
          event.preventDefault();
          return false;
        }
        break;
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 57:
        if (!isValidNumber()) {
          event.preventDefault();
          return false;
        }
        break;
      case 107:
      case 109:
      case 111:
      case 106:
      case 189:
      case 187:
      case 191:
        if (!isValidOperator()) {
          event.preventDefault();
          return false;
        }
        break;

      default:
        event.preventDefault();
        return false;
    }
  };

  const canInsertVariable = (): boolean => {
    // Can't be after a Number, another variable a ., a closing bracket
    // Can't be before a opening bracket, a ., a number or another variable
    const previousString = value.substring(0, selectionEnd);
    const nextString = value.substring(selectionEnd, value.length);
    const previousChar = previousString.charAt(previousString.length - 1);
    const nextChar = nextString.length > 0 ? nextString.charAt(0) : "";
    if (
      previousChar === "." ||
      previousChar === ")" ||
      /[a-zA-Z0-9]/g.test(`${previousChar}`)
    ) {
      return false;
    }

    if (
      nextChar === "." ||
      nextChar === ")" ||
      /[a-zA-Z0-9]/g.test(`${nextChar}`)
    ) {
      return false;
    }
    return true;
  };

  const isValidOpenBracket = () => {
    // Number of open and closed brackets before this new bracket should be equal
    // Can't have a bracket after a number, . or variable
    const previousString = value.substring(0, selectionEnd);
    const nextString = value.substring(selectionEnd, value.length);
    if (
      (previousString.match(/\(/g) || []).length !==
      (previousString.match(/\)/g) || []).length
    ) {
      return false;
    }
    const previousChar = previousString.charAt(previousString.length - 1);
    const nextChar = nextString.length > 0 ? nextString.charAt(0) : "";
    if (previousChar === "." || /[a-zA-Z0-9\.]/g.test(`${previousChar}`)) {
      return false;
    }
    if (["+", "-", "*", "/", ".", "(", ")"].includes(`${nextChar}`)) {
      return false;
    }
    return true;
  };

  const isValidClosingBracket = () => {
    // Number of open  brackets before selectionEnd must greater than closing brackets
    // Can't have a bracket after another bracket, a . or an operator
    // Can't have a bracket before a number or a variable
    const previousString = value.substring(0, selectionEnd);
    const nextString = value.substring(selectionEnd, value.length);
    if (
      (previousString.match(/\(/g) || []).length <=
      (previousString.match(/\)/g) || []).length
    ) {
      return false;
    }
    const previousChar = previousString.charAt(previousString.length - 1);

    const nextChar = nextString.length > 0 ? nextString.charAt(0) : "";
    if (["(", ")", ".", "+", "-", "/", "*"].includes(previousChar)) {
      return false;
    }
    if (/[a-zA-Z[0-9]]/g.test(`${previousChar}`)) {
      return false;
    }
    if (
      nextChar === "(" ||
      nextChar === "." ||
      /[a-zA-Z[0-9]]/g.test(`${nextChar}`)
    ) {
      return false;
    }
    return true;
  };

  const isValidNumber = (): boolean => {
    // Can't go before an opening bracket
    // Can't go after a closing bracket
    const previousString = value.substring(0, selectionEnd);
    const nextString = value.substring(selectionEnd, value.length);

    const previousChar = previousString.charAt(previousString.length - 1);
    const nextChar = nextString.length > 0 ? nextString.charAt(0) : "";
    if (
      /[a-zA-Z]/g.test(`${previousChar}`) ||
      previousChar === ")" ||
      nextChar === "("
    ) {
      return false;
    }
    return true;
  };

  const isValidOperator = () => {
    // must go after a variable or a number
    const previousString = value.substring(0, selectionEnd);
    if (previousString.length === 0) {
      return false;
    }
    const previousChar = previousString.charAt(previousString.length - 1);
    if (["+", "-", "/", "*", "(", ")", "."].includes(`${previousChar}`)) {
      return false;
    }
    return true;
  };

  const handleItemClick = (event: any) => {
    const map: NamedNodeMap = event.currentTarget.attributes;
    const id = map.getNamedItem("data-id")?.value.replace(/ /g, "");
    setValue((value) =>
      value.trim().length > 0 ? ` ${value}${id}` : `${value}${id}`
    );
    setDisplayList(false);
  };

  const customHandleOnChange = (event: any) => {
    setValue(event.target.value);
    handleOnChange(event);
  };

  return {
    handleKeyDown,
    handleKeyUp,
    displayList,
    handleItemClick,
    value,
    customHandleOnChange,
    handleSelectionEnd,
  };
};

const FormulaTextField = ({
  id,
  handleOnChange,
  values,
}: {
  id: string;
  handleOnChange: (event: any) => void;
  values: string[];
}) => {
  const classes = useGlobalClasses();
  const {
    handleKeyDown,
    handleKeyUp,
    displayList,
    handleItemClick,
    value,
    customHandleOnChange,
    handleSelectionEnd,
  } = useFormulaTextField(id, handleOnChange);
  const renderFormulaList = () => {
    if (!displayList) {
      return null;
    }
    return <FormulaList values={values} handleItemClick={handleItemClick} />;
  };

  return (
    <Box>
      <TextField
        id={id}
        label=""
        variant="outlined"
        onChange={customHandleOnChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleSelectionEnd}
        value={value}
        className={classes.formulaInput}
      />
      {renderFormulaList()}
    </Box>
  );
};
export default FormulaTextField;

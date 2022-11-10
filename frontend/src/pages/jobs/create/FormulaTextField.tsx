import { TextField } from "@mui/material";

const FormulaTextField = ({
  id,
  value,
  handleOnChange,
}: {
  id: string;
  value: string;
  handleOnChange: (event: any) => void;
}) => {
  return (
    <TextField
      id={id}
      label=""
      variant="outlined"
      onChange={handleOnChange}
      value={value}
    />
  );
};
export default FormulaTextField;

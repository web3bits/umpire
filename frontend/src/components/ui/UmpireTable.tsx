import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ICreateJob } from "../../context/GlobalContext";

const buildTableHeader = (tableId: string, columns: string[]) => {
  return columns?.map((column: string, index: number) => (
    <TableCell key={`${tableId}-${index}`}>{column}</TableCell>
  ));
};

const formatRow = (row: ICreateJob): any => {
  const {
    jobId,
    jobName,
    status,
    leftSide,
    comparator,
    rightSide,
    dateCreated,
    activationDate,
    deadlineDate,
  } = row;
  return {
    jobId,
    jobName,
    status,
    formula: `${leftSide} ${comparator} ${rightSide}`,
    dateCreated,
    timeout: activationDate && deadlineDate ? deadlineDate - activationDate : 0,
  };
};
const UmpireTable = ({
  tableId,
  columns,
  rows,
}: {
  tableId: string;
  columns: any[];
  rows: any[];
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" id={tableId}>
        <TableHead>
          <TableRow>{buildTableHeader(tableId, columns)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const formattedRow = formatRow(row);
            return (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Object.keys(formattedRow).map((key: string, index: number) => (
                  <TableCell
                    component="th"
                    scope="row"
                    key={`${key}-${index}-row`}
                  >
                    {formattedRow[key]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UmpireTable;

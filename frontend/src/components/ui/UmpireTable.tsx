import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const buildTableHeader = (tableId: string, columns: string[]) => {
  return columns?.map((column: string, index: number) => (
    <TableCell key={`${tableId}-${index}`}>{column}</TableCell>
  ));
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
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.keys(row).map((key: string, index: number) => (
                <TableCell
                  component="th"
                  scope="row"
                  key={`${key}-${index}-row`}
                >
                  {row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UmpireTable;

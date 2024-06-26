import React from "react";
import {
  TableCell,
  TableBody,
  Table,
  TableContainer,
  Paper,
} from "@mui/material";
import CustomSkeleton from "./CustomSkeleton";
const TableSkeleton = ({ column }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {Array.from({ length: column }).map((_, i) => {
            return (
              <TableCell key={i}>
                <CustomSkeleton
                  width={"100%"}
                  height={40}
                  length={10}
                  marginTop={"25px"}
                />
              </TableCell>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;

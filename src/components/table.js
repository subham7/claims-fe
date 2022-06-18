import * as React from 'react';
import { Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  tableheading: {
    color: "#C1D3FF",
    fontSize: "22px",
  },
  tablecontent: {
    fontSize: "22px",
    color: "#F5F5F5",
  },
  tablecontent2: {
    fontSize: "22px",
  },
  membersTitleSmall: {
    fontSize: "24px",
    color: "#FFFFFF",
    backgroundColor: "#19274B"
  },
});

function createData(token, balance, value, daychange) {
  return { token, balance, value, daychange };
}

const rows = [
  createData("USDC", "8462 $USDC", 24, 4.0),
  createData("WBTC", 9.0, 37, -1),
  createData("APE", 16.0, 24, 6.0),
  createData("STNX", 3.7, 67, 4.3),
  createData("MATIC", 16.0, 49, 3.9),
  createData("USDT", 16.0, 49, 3.9),
];

export default function BasicTable(props) {
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      {props.title !== null ?
          <Typography className={classes.membersTitleSmall}>{props.title}</Typography> :
          null
      }
      <Table sx={{ minWidth: 809 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.tableheading}>Token</TableCell>
            <TableCell align="left" className={classes.tableheading}>Balance</TableCell>
            <TableCell align="left" className={classes.tableheading}>Value (USD)</TableCell>
            <TableCell align="left" className={classes.tableheading}>Day change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left" className={classes.tablecontent}><></>{row.token}</TableCell>
              <TableCell align="left" className={classes.tablecontent}>{row.balance}</TableCell>
              <TableCell align="left" className={classes.tablecontent}>${row.value}</TableCell>
              <TableCell align="left"className={classes.tablecontent2} sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
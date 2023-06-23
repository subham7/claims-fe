import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const dummyData = [
  {
    date: "26/07/23",
    wallet: "0x51f...890D",
    totalTokens: 500,
    claimed: 80,
    percentage: 90,
  },
  {
    date: "26/07/23",
    wallet: "0x51f...890D",
    totalTokens: 500,
    claimed: 80,
    percentage: 90,
  },
  {
    date: "26/07/23",
    wallet: "0x51f...890D",
    totalTokens: 500,
    claimed: 80,
    percentage: 90,
  },
  {
    date: "26/07/23",
    wallet: "0x51f...890D",
    totalTokens: 500,
    claimed: 80,
    percentage: 90,
  },
  {
    date: "26/07/23",
    wallet: "0x51f...890D",
    totalTokens: 500,
    claimed: 80,
    percentage: 90,
  },
];

const ClaimsTransactions = () => {
  const classes = ClaimsInsightStyles();
  const header = ["Date", "Wallet", "Total tokens", "Claimed", "Percentage"];

  return (
    <div className={classes.claimsTransactionContainer}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
        }}>
        <button
          style={{
            background: "#19274B",
            padding: "15px 30px ",
            borderRadius: "6px",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}>
          Wallet wise
        </button>
        <button
          style={{
            background: "#19274B",
            padding: "15px 20px ",
            borderRadius: "6px",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}>
          All transactions
        </button>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 809 }} aria-label="simple table">
          <TableHead
            sx={{
              border: "0.5px solid #6475A3",
              overflow: "hidden",
            }}>
            <TableRow>
              {header.map((data, key) => {
                return (
                  <TableCell
                    sx={{
                      minWidth: "100px",
                      fontSize: "16px",
                      background: "#142243",
                    }}
                    align="left"
                    variant="tableHeading"
                    key={key}>
                    {data}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              border: "0.5px solid #6475A3",
            }}>
            {dummyData?.map((data, key) => (
              <TableRow
                key={key}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  fontSize: "14px",
                }}>
                <TableCell align="left" variant="tableBody">
                  {new Date(+data.timeStamp * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell align="left" variant="tableBody">
                  <Grid container direction="row" alignItems="center" gap={4}>
                    <Grid
                      sx={{
                        flex: "0.7",
                      }}
                      item>
                      <a className={classes.activityLink}>
                        {data.wallet.substring(0, 6) +
                          "......" +
                          data.wallet.substring(data.wallet.length - 4)}{" "}
                      </a>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="left" variant="tableBody">
                  {data.totalTokens} $USDC
                </TableCell>
                <TableCell align="left" variant="tableBody">
                  {data.claimed} $USDC
                </TableCell>

                <TableCell align="left" variant="tableBody">
                  {data.percentage} %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClaimsTransactions;

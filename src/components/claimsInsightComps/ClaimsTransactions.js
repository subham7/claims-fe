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
import React, { useEffect, useState } from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";
import { subgraphQuery } from "../../utils/subgraphs";
import {
  QUERY_ALL_CLAIMS_TRANSACTIONS,
  QUERY_WALLET_WISE_TRANSACTIONS,
} from "../../api/graphql/queries";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { FiExternalLink } from "react-icons/fi";
import { useNetwork } from "wagmi";
import Web3 from "web3";
import { CLAIMS_SUBGRAPH_URL } from "utils/constants";

const ClaimsTransactions = ({
  claimAddress,
  airdropTokenDetails,
  maxClaimAmount,
}) => {
  const [walletWiseTransactionData, setWalletWiseTransactionData] = useState(
    [],
  );
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const [isWalletSelected, setIsWalletSelected] = useState(true);
  const [isAllTransactionSelected, setIsAllTransactionSelected] =
    useState(false);
  const { chain } = useNetwork();
  const networkId = Web3.utils.numberToHex(chain?.id);

  const classes = ClaimsInsightStyles();
  const walletHeaders = ["Wallet", "Total tokens", "Claimed", "Percentage"];
  const allTransactionHeaders = [
    "Date",
    "Tx Hash",
    "Wallet",
    "Total tokens",
    "Claimed",
    "Percentage",
  ];

  const fetchWalletWiseTransactions = async () => {
    const { claimers } = await subgraphQuery(
      CLAIMS_SUBGRAPH_URL[networkId],
      QUERY_WALLET_WISE_TRANSACTIONS(claimAddress),
    );
    setWalletWiseTransactionData(claimers);
  };

  const fetchAllTransactions = async () => {
    const { airdrops } = await subgraphQuery(
      CLAIMS_SUBGRAPH_URL[networkId],
      QUERY_ALL_CLAIMS_TRANSACTIONS(claimAddress),
    );
    setAllTransactionsData(airdrops?.reverse());
  };

  useEffect(() => {
    if (claimAddress) {
      fetchWalletWiseTransactions();
      fetchAllTransactions();
    }
  }, [claimAddress]);

  return (
    <div className={classes.claimsTransactionContainer}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
        }}>
        <button
          onClick={() => {
            setIsWalletSelected(true);
            setIsAllTransactionSelected(false);
          }}
          style={{
            background: isWalletSelected ? "#19274B" : "#121D38",
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
          onClick={() => {
            setIsAllTransactionSelected(true);
            setIsWalletSelected(false);
          }}
          style={{
            background: isAllTransactionSelected ? "#19274B" : "#121D38",
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
              {isWalletSelected ? (
                <>
                  {walletHeaders.map((data, key) => {
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
                </>
              ) : (
                <>
                  {allTransactionHeaders.map((data, key) => {
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
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              border: "0.5px solid #6475A3",
            }}>
            {isWalletSelected ? (
              <>
                {walletWiseTransactionData?.map((data, key) => (
                  <TableRow
                    key={key}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      fontSize: "12px",
                    }}>
                    <TableCell align="left" variant="tableBody">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        gap={4}>
                        <Grid
                          sx={{
                            flex: "0.7",
                          }}
                          item>
                          <a className={classes.activityLink}>
                            {data.claimerAddress.substring(0, 6) +
                              "......" +
                              data.claimerAddress.substring(
                                data.claimerAddress.length - 4,
                              )}{" "}
                          </a>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {Number(
                        convertFromWeiGovernance(
                          maxClaimAmount,
                          airdropTokenDetails.tokenDecimal,
                        ),
                      ).toFixed(2)}{" "}
                      ${airdropTokenDetails.tokenSymbol}
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {Number(
                        convertFromWeiGovernance(
                          data.totalAmountClaimed,
                          airdropTokenDetails.tokenDecimal,
                        ),
                      ).toFixed(2)}{" "}
                      ${airdropTokenDetails.tokenSymbol}
                    </TableCell>

                    <TableCell align="left" variant="tableBody">
                      {Number(
                        (+data.totalAmountClaimed / +maxClaimAmount) * 100,
                      ).toFixed(2)}{" "}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {allTransactionsData?.map((data, key) => (
                  <TableRow
                    key={key}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      fontSize: "12px",
                    }}>
                    <TableCell align="left" variant="tableBody">
                      {new Date(+data.timestamp * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}>
                        {data.txHash.substring(0, 6) +
                          "......" +
                          data.txHash.substring(data.txHash.length - 4)}

                        <FiExternalLink
                          onClick={() => {
                            window.open(
                              `https://polygonscan.com/tx/${data.txHash}`,
                              "_blank",
                            );
                          }}
                          style={{ cursor: "pointer" }}
                          size={15}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {data.claimerAddress.substring(0, 6) +
                        "......" +
                        data.claimerAddress.substring(
                          data.claimerAddress.length - 4,
                        )}
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {Number(
                        convertFromWeiGovernance(
                          maxClaimAmount,
                          airdropTokenDetails.tokenDecimal,
                        ),
                      ).toFixed(2)}{" "}
                      ${airdropTokenDetails.tokenSymbol}
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {Number(
                        convertFromWeiGovernance(
                          data.amountClaimed,
                          airdropTokenDetails.tokenDecimal,
                        ),
                      ).toFixed(2)}{" "}
                      ${airdropTokenDetails.tokenSymbol}
                    </TableCell>

                    <TableCell align="left" variant="tableBody">
                      {Number(
                        (+data.amountClaimed / +maxClaimAmount) * 100,
                      ).toFixed(2)}{" "}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!walletWiseTransactionData.length && !allTransactionsData.length && (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}>
          No transactions available.
        </p>
      )}
    </div>
  );
};

export default ClaimsTransactions;

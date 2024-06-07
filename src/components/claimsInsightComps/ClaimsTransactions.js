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
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { FiExternalLink } from "react-icons/fi";
import { useChainId } from "wagmi";

import {
  queryAllDropsTransactionsFromSubgraph,
  queryWalletWiseTransactionsFromSubgraph,
} from "utils/dropsSubgraphHelper";
import { shortAddress } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import { useTheme } from "@mui/styles";

const ClaimsTransactions = ({
  claimAddress,
  airdropTokenDetails,
  maxClaimAmount,
  routeNetworkId,
}) => {
  const [walletWiseTransactionData, setWalletWiseTransactionData] = useState(
    [],
  );
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const [isWalletSelected, setIsWalletSelected] = useState(true);
  const [isAllTransactionSelected, setIsAllTransactionSelected] =
    useState(false);
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);
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
    try {
      const { claimers } = await queryWalletWiseTransactionsFromSubgraph(
        claimAddress,
        routeNetworkId,
      );

      if (claimers.length) setWalletWiseTransactionData(claimers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const { airdrops } = await queryAllDropsTransactionsFromSubgraph(
        claimAddress,
        routeNetworkId,
      );

      if (airdrops.length) setAllTransactionsData(airdrops?.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (claimAddress && networkId) {
      fetchWalletWiseTransactions();
      fetchAllTransactions();
    }
  }, [claimAddress, networkId]);

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

      <TableContainer
        sx={{
          overflow: "hidden",
        }}
        component={Paper}>
        <Table sx={{ minWidth: 809 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {isWalletSelected ? (
                <>
                  {walletHeaders.map((data, key) => {
                    return (
                      <TableCell
                        sx={{
                          minWidth: "100px",
                          fontSize: "16px",
                          background: "#151515",
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
                          background: "#151515",
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
          <TableBody>
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
                            {shortAddress(data.claimerAddress)}
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
                        {shortAddress(data.txHash)}
                        <FiExternalLink
                          onClick={() => {
                            window.open(
                              `${CHAIN_CONFIG[networkId].blockExplorerUrl}/tx/${data.txHash}`,
                              "_blank",
                            );
                          }}
                          style={{ cursor: "pointer" }}
                          size={15}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="left" variant="tableBody">
                      {shortAddress(data.claimerAddress)}
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

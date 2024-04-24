import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import {
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  CircularProgress,
  Chip,
  TablePagination,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import { CHAIN_CONFIG } from "utils/constants";
import ComponentHeader from "@components/common/ComponentHeader";
import { getTransactionsByNetworkId } from "api/transactions";
import { customToFixedAutoPrecision } from "utils/helper";

dayjs.extend(relativeTime);

const Transactions = ({ networkId }) => {
  const tableHeaders = [
    "Asset",
    "Tx",
    "Type",
    "Timestamp",
    "From/To",
    "Amount ",
  ];

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [paginationSettings, setPaginationSettings] = useState({
    page: 0,
    limit: 25,
    offset: 0,
  });

  const { page, limit, offset } = paginationSettings;

  const fetchTransactions = async () => {
    setLoading(true);

    const transactions = await getTransactionsByNetworkId(
      Web3.utils.toChecksumAddress(gnosisAddress),
      networkId,
      limit,
      offset,
    );
    setLoading(false);
    setTransactions(transactions);
  };

  useEffect(() => {
    if (gnosisAddress) fetchTransactions();
  }, [gnosisAddress, limit, offset, fetch]);

  const handleAddressClick = (event, address) => {
    event.preventDefault();
    window.open(
      `${CHAIN_CONFIG[networkId].blockExplorerUrl}/address/${address}`,
    );
  };
  const handleHashClick = (event, hash) => {
    event.preventDefault();
    window.open(`${CHAIN_CONFIG[networkId].blockExplorerUrl}/tx/${hash}`);
  };

  const handleChangePage = (event, newPage) => {
    setPaginationSettings({
      ...paginationSettings,
      page: newPage,
      offset: newPage * limit,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPaginationSettings({
      page: 0,
      limit: parseInt(event.target.value, 10),
    });
  };

  return (
    <>
      <div className="f-d f-vt f-h-c w-80">
        <div className="b-pad-1">
          <ComponentHeader title={"Transactions"} />
        </div>
        {/* Table */}
        <div>
          {/* Loader */}
          {loading ? (
            <div className="tb-pad-2 f-d f-h-c f-v-c">
              <CircularProgress />
            </div>
          ) : !loading && !transactions?.transfers?.length ? (
            <div className="tb-pad-2 f-d f-h-c f-v-c">
              <Typography variant="inherit">No Transactions to show</Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  {tableHeaders.map((data, key) => (
                    <TableCell
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "16px",
                        color: "#707070",
                        background: "#111111",
                      }}
                      align="left"
                      variant="tableHeading"
                      key={key}>
                      {data}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {transactions?.transfers?.map((txn) => {
                    return (
                      <>
                        <TableRow key={txn.transactionHash}>
                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            <div className="f-d f-v-c f-gap-8">
                              <img
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  marginBottom: "6px",
                                }}
                                src={txn.tokenInfo?.logoUri}
                                alt=""
                                onError={({ target }) => {
                                  target.onerror = null;
                                  target.src =
                                    "/assets/images/fallbackUSDC.png";
                                }}
                              />
                              <Typography variant="inherit">
                                {txn.tokenInfo?.name}
                              </Typography>
                            </div>
                          </TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            <div className="f-d f-v-c f-gap-8">
                              <Typography
                                variant="inherit"
                                className="text-blue">
                                <Tooltip title={txn.transactionHash}>
                                  <div
                                    className="f-d f-gap-8 f-v-c c-pointer"
                                    onClick={(e) => {
                                      handleHashClick(e, txn.transactionHash);
                                    }}>
                                    {txn.transactionHash?.substring(0, 10) +
                                      "... "}
                                    <OpenInNewIcon
                                      fontSize="14px"
                                      className="c-pointer"
                                    />
                                  </div>
                                </Tooltip>
                              </Typography>
                            </div>
                          </TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            {txn.to === gnosisAddress && (
                              <Chip
                                icon={
                                  <ExpandCircleDownIcon
                                    sx={{
                                      color: "#0ABB92 !important",
                                    }}
                                  />
                                }
                                sx={{
                                  width: "135px",
                                }}
                                className="f-d f-h-c f-ht-r text-primary"
                                variant="outlined"
                                color="success"
                                label="Received"
                              />
                            )}
                            {txn.from === gnosisAddress && (
                              <Chip
                                icon={
                                  <ExpandCircleDownIcon
                                    sx={{
                                      transform: "rotate(180deg)",
                                      color: "#D55438 !important",
                                    }}
                                  />
                                }
                                sx={{
                                  width: "135px",
                                }}
                                className="f-d f-h-c f-ht-r text-primary"
                                variant="outlined"
                                color="error"
                                label="Withdrawal"
                              />
                            )}
                          </TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            <Typography variant="inherit">
                              {dayjs(txn?.executionDate).fromNow()}
                            </Typography>
                          </TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            <Typography variant="inherit" className="text-blue">
                              <Tooltip title={txn?.from}>
                                <a
                                  onClick={(e) => {
                                    handleAddressClick(e, txn.from);
                                  }}>
                                  {txn.from?.substring(0, 10) + "... "}
                                </a>
                              </Tooltip>
                              /
                              <Tooltip title={txn.to}>
                                <a
                                  onClick={(e) => {
                                    handleAddressClick(e, txn.to);
                                  }}>
                                  {txn.to?.substring(0, 10) + "..."}
                                </a>
                              </Tooltip>
                            </Typography>
                          </TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "inherit",
                              fontSize: "16px",
                              background: "#111111",
                            }}
                            align="left">
                            <Typography variant="inherit">
                              {txn.value == null
                                ? "---"
                                : customToFixedAutoPrecision(
                                    txn.value / 10 ** txn.tokenInfo?.decimals,
                                  )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>

              <TablePagination
                align="right"
                rowsPerPageOptions={[10, 25, 50]}
                component="row"
                count={transactions?.count}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default Transactions;

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { Typography } from "@components/ui";
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
} from "@mui/material";
import { CHAIN_CONFIG } from "utils/constants";
import ComponentHeader from "@components/common/ComponentHeader";
import { getTransactionsByNetworkId } from "api/transactions";
import { customToFixedAutoPrecision } from "utils/helper";

dayjs.extend(relativeTime);

const Transactions = ({ networkId }) => {
  const tableHeaders = [
    "Token",
    "Txn Hash",
    "Tag",
    "Age",
    "From/To",
    "Tokens ",
  ];

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [paginationSettings, setPaginationSettings] = useState({
    page: 0,
    noOfRowsPerPage: 25,
  });

  const { page, noOfRowsPerPage } = paginationSettings;

  const fetchTransactions = async () => {
    setLoading(true);

    const transfers = await getTransactionsByNetworkId(
      Web3.utils.toChecksumAddress(gnosisAddress),
      networkId,
    );
    setLoading(false);
    setTransactions(transfers);
  };

  useEffect(() => {
    if (gnosisAddress) fetchTransactions();
  }, [gnosisAddress]);

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
    setPaginationSettings({ ...paginationSettings, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setPaginationSettings({
      page: 0,
      noOfRowsPerPage: parseInt(event.target.value, 10),
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
          ) : !loading && !transactions.length ? (
            <div className="tb-pad-2 f-d f-h-c f-v-c">
              <Typography variant="subheading">
                No Transactions to show
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  {tableHeaders.map((data, key) => (
                    <TableCell align="left" variant="tableHeading" key={key}>
                      {data}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {transactions
                    ?.slice(
                      page * noOfRowsPerPage,
                      (page + 1) * noOfRowsPerPage,
                    )
                    .map((txn) => {
                      return (
                        <>
                          <TableRow key={txn.transactionHash}>
                            <TableCell align="left">
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
                                <Typography variant="info">
                                  {txn.tokenInfo?.name}
                                </Typography>
                              </div>
                            </TableCell>

                            <TableCell align="left">
                              <div className="f-d f-v-c f-gap-8">
                                <Typography
                                  variant="info"
                                  className="text-blue">
                                  <Tooltip title={txn.transactionHash}>
                                    <div
                                      className="f-d f-gap-8 f-v-c c-pointer"
                                      onClick={(e) => {
                                        handleHashClick(e, txn.transactionHash);
                                      }}>
                                      {txn.transactionHash?.substring(0, 10) +
                                        "... "}
                                      <OpenInNewIcon className="c-pointer" />
                                    </div>
                                  </Tooltip>
                                </Typography>
                              </div>
                            </TableCell>

                            <TableCell align="left">
                              {txn.to.toLowerCase() === gnosisAddress && (
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
                              {txn.from?.toLowerCase() === gnosisAddress && (
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

                            <TableCell align="left">
                              <Typography variant="info">
                                {dayjs(txn?.executionDate).fromNow()}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="info" className="text-blue">
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

                            <TableCell align="left">
                              <Typography variant="body">
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
                count={transactions.length}
                rowsPerPage={noOfRowsPerPage}
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

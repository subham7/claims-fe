import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Layout1 from "@components/layouts/layout1";
import { TextField, Typography } from "@components/ui";
import Image from "next/image";
import {
  InputAdornment,
  Select,
  MenuItem,
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

dayjs.extend(relativeTime);

const Transactions = () => {
  const filters = ["All", "Withdrawal", "Received"];
  const tableHeaders = ["Token", "Tag", "Age", "From/To", "Value (in $)"];
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filters[0]);
  const [transactions, setTransactions] = useState([]);
  const [paginationSettings, setPaginationSettings] = useState({
    page: 0,
    noOfRowsPerPage: 5,
  });

  const { page, noOfRowsPerPage } = paginationSettings;

  const fetchTransactions = async () => {
    const address = Web3.utils.toChecksumAddress(gnosisAddress);
    const res = await axios.get(
      `https://safe-transaction-polygon.safe.global/api/v1/safes/${address}/all-transactions/?ordering=hash&executed=true&queued=false`,
    );
    const results = res.data.results;
    let transfers = [];

    results.forEach((res) => {
      transfers = [...transfers, ...res.transfers];
    });
    setTransactions(transfers);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = () => {};

  const handleAddressClick = (event, address) => {
    event.preventDefault();
    window.open(`https://polygonscan.com/address/${address}`);
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
      <Layout1 page={6}>
        <div className="f-d f-vt f-h-c tb-pad-6 w-70">
          <Typography variant="heading">Station Transactions</Typography>

          {/* Search Bar */}
          <div className="f-d f-v-c f-h-s f-gap-16 w-70">
            <div className="w-70">
              <TextField
                variant="outlined"
                label="Search"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  style: { borderRadius: "50px" },
                }}
              />
            </div>
            <div className="w-30">
              <Select
                className="w-100 br-50"
                value={"All"}
                onChange={handleFilterChange}
                inputProps={{
                  "aria-label": "Without label",
                }}
                name="clubTokenType"
                id="clubTokenType">
                {filters.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Table */}
          <div>
            <TableContainer component={Paper}>
              {/* Loader */}
              {transactions.length === 0 && (
                <div className="tb-pad-2 f-d f-h-c f-v-c">
                  <CircularProgress />
                </div>
              )}

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
                    .map((txn, key) => {
                      return (
                        <>
                          <TableRow key={txn.transactionHash}>
                            <TableCell align="left">
                              <div className="f-d f-v-c f-gap-8">
                                <Image
                                  width={30}
                                  height={30}
                                  src={txn.tokenInfo.logoUri}
                                  alt=""
                                />
                                <Typography variant="info">
                                  {txn.tokenInfo.name}
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
                                  className="f-d f-h-c f-ht-r text-primary"
                                  variant="outlined"
                                  color="success"
                                  label="Received"
                                />
                              )}
                              {txn.from.toLowerCase() === gnosisAddress && (
                                <Chip
                                  icon={
                                    <ExpandCircleDownIcon
                                      sx={{
                                        transform: "rotate(180deg)",
                                        color: "#D55438 !important",
                                      }}
                                    />
                                  }
                                  className="f-d f-h-c f-ht-r text-primary"
                                  variant="outlined"
                                  color="error"
                                  label="Withdrawal"
                                />
                              )}
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="info">
                                {dayjs(txn.executionDate).fromNow()}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="info" className="text-blue">
                                <Tooltip title={txn.from}>
                                  <a
                                    onClick={(e) => {
                                      handleAddressClick(e, txn.from);
                                    }}>
                                    {txn.from.substring(0, 10) + "... "}
                                  </a>
                                </Tooltip>
                                /
                                <Tooltip title={txn.to}>
                                  <a
                                    onClick={(e) => {
                                      handleAddressClick(e, txn.to);
                                    }}>
                                    {txn.to.substring(0, 10) + "..."}
                                  </a>
                                </Tooltip>
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="body">
                                ${txn.value / 10 ** txn.tokenInfo.decimals}
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
                rowsPerPageOptions={[5, 10, 25]}
                component="row"
                count={transactions.length}
                rowsPerPage={noOfRowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        </div>
      </Layout1>
    </>
  );
};

export default Transactions;

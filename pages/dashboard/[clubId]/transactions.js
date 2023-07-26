import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import Layout1 from "@components/layouts/layout1";
import { TextField, Typography } from "@components/ui";
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
} from "@mui/material";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

dayjs.extend(relativeTime);

const Transactions = () => {
  const filters = ["All", "Withdrawal", "Received"];
  const tableHeaders = [
    "Token",
    "Amount",
    "Tag",
    "Age",
    "From/To",
    "Value (in $)",
  ];
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });
  const userAdddress = useSelector((state) => {
    return state.user.wallet;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filters[0]);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
      }
      const chain = EvmChain.POLYGON;
      const address = gnosisAddress;
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        address,
        chain,
      });
      console.log(response.toJSON().result);
      setTransactions(response.toJSON().result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = () => {};

  const handleAddressClick = (event, address) => {
    event.preventDefault();
    window.open(`https://polygonscan.com/address/${address}`);
  };

  return (
    <>
      <Layout1 page={6}>
        <div className="f-d f-vt f-h-c tb-pad-6">
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
            <Table sx={{ minWidth: 809 }} aria-label="simple table">
              <TableHead>
                {tableHeaders.map((data, key) => (
                  <TableCell align="left" variant="tableHeading" key={key}>
                    {data}
                  </TableCell>
                ))}
              </TableHead>

              <TableBody>
                {transactions?.map((txn, key) => {
                  return (
                    <>
                      <TableRow key={txn.hash}>
                        <TableCell align="left">
                          <Typography variant="info">Ethereum</Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="info">$$$</Typography>
                        </TableCell>

                        <TableCell align="left">
                          {txn.to_address === userAdddress && (
                            <Chip
                              variant="outlined"
                              color="success"
                              label="RECEIVED"
                            />
                          )}
                          {txn.from_address === userAdddress && (
                            <Chip
                              variant="outlined"
                              color="error"
                              label="WITHDRAWAL"
                            />
                          )}
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="info">
                            {dayjs(txn.block_timestamp).fromNow()}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="info" className="text-blue">
                            <Tooltip title={txn.from_address}>
                              <a
                                onClick={(e) => {
                                  handleAddressClick(e, txn.from_address);
                                }}>
                                {txn.from_address.substring(0, 10) + "... "}
                              </a>
                            </Tooltip>
                            /
                            <Tooltip title={txn.to_address}>
                              <a
                                onClick={(e) => {
                                  handleAddressClick(e, txn.to_address);
                                }}>
                                {txn.to_address.substring(0, 10) + "..."}
                              </a>
                            </Tooltip>
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="info">{txn.value} $</Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
            {transactions.length === 0 && (
              <div className="f-d w-70 f-h-c f-v-c">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </Layout1>
    </>
  );
};

export default Transactions;

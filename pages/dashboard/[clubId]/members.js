import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QUERY_ALL_MEMBERS } from "../../../src/api/graphql/queries";
import Layout1 from "../../../src/components/layouts/layout1";
import { convertFromWeiGovernance } from "../../../src/utils/globalFunctions";
import { subgraphQuery } from "../../../src/utils/subgraphs";
import ClubFetch from "../../../src/utils/clubFetch";
import { useConnectWallet } from "@web3-onboard/react";
import { showWrongNetworkModal } from "../../../src/utils/helper";

const useStyles = makeStyles({
  searchField: {
    width: "548px",
    height: "55px",
    color: "#C1D3FF",
    backgroundColor: "#111D38",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  listFont: {
    fontSize: "22px",
    color: "#C1D3FF",
  },
  activityLink: {
    color: "#C1D3FF",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
});

const Test = () => {
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const header = [
    "Member address",
    "Deposit amount",
    "Station tokens",
    "Joined on",
  ];
  const router = useRouter();
  const classes = useStyles();
  const { clubId: daoAddress } = router.query;
  const [{ wallet }] = useConnectWallet();

  const networkId = wallet?.chains[0].id;

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const handleAddressClick = (event, address) => {
    event.preventDefault();
    window.open(
      `https://${
        networkId === "0x5"
          ? "goerli.etherscan.io/"
          : networkId === "0x89"
          ? "polygonscan.com"
          : ""
      }/address/${address}`,
    );
  };

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        if (daoAddress) {
          const data = await subgraphQuery(
            SUBGRAPH_URL,
            QUERY_ALL_MEMBERS(daoAddress),
          );
          let membersArray = [];
          data?.users?.map((member) => membersArray.push(member.userAddress));

          setMembersData(data?.users);
        }
      };
      fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [SUBGRAPH_URL, daoAddress]);

  return (
    <>
      <Layout1 page={3}>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={3}>
            <Grid item md={9}>
              <Grid container mb={10}>
                <Grid item>
                  <Typography variant="title">Station Members</Typography>
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 809 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {header.map((data, key) => {
                        return (
                          <TableCell
                            align="left"
                            variant="tableHeading"
                            key={key}>
                            {data}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {membersData?.map((data, key) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
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
                              <a
                                className={classes.activityLink}
                                onClick={(e) => {
                                  handleAddressClick(e, data.userAddress);
                                }}>
                                {" "}
                                {data.userAddress.substring(0, 6) +
                                  "......" +
                                  data.userAddress.substring(
                                    data.userAddress.length - 4,
                                  )}{" "}
                              </a>
                            </Grid>
                            <Grid item flex={0.3}>
                              <IconButton
                                color="primary"
                                onClick={(e) => {
                                  handleAddressClick(e, data.userAddress);
                                }}>
                                <OpenInNewIcon
                                  className={classes.activityLink}
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align="left" variant="tableBody">
                          {Number(
                            convertFromWeiGovernance(data.depositAmount, 6),
                          ).toFixed(2)}{" "}
                          USDC
                        </TableCell>
                        <TableCell align="left" variant="tableBody">
                          {tokenType === "erc20"
                            ? Number(
                                convertFromWeiGovernance(data?.gtAmount, 18),
                              ).toFixed(2)
                            : data?.gtAmount}
                        </TableCell>
                        <TableCell align="left" variant="tableBody">
                          {new Date(
                            +data.timeStamp * 1000,
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>

        {showWrongNetworkModal(wallet, networkId)}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  );
};

export default ClubFetch(Test);

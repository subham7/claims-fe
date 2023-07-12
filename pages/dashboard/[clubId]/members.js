import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QUERY_PAGINATED_MEMBERS } from "../../../src/api/graphql/queries";
import Layout1 from "../../../src/components/layouts/layout1";
import { convertFromWeiGovernance } from "../../../src/utils/globalFunctions";
import { subgraphQuery } from "../../../src/utils/subgraphs";
import ClubFetch from "../../../src/utils/clubFetch";
import { useConnectWallet } from "@web3-onboard/react";
import {
  getAllEntities,
  showWrongNetworkModal,
} from "../../../src/utils/helper";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import { saveAs } from "file-saver";

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
  const [downloadLoading, setDownloadLoading] = useState(false);

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

  const Members_Count = useSelector((state) => {
    return state.club.clubData.membersCount;
  });

  const deployedTime = useSelector((state) => {
    return state.club.clubData.deployedTime;
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
            QUERY_PAGINATED_MEMBERS(daoAddress, 20, 0, 1685613616, Date.now()),
            "users",
          );
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

  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = async (event, newPage) => {
    console.log("1", skip);

    try {
      setPage(newPage);
      const newSkip = newPage * rowsPerPage;
      const data = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_PAGINATED_MEMBERS(
          daoAddress,
          20,
          newSkip,
          1685613616,
          Date.now(),
        ),
      );
      setMembersData(data?.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const MembersValidationSchema = yup.object({
    startDate: yup
      .date()
      .min(
        dayjs(deployedTime * 1000),
        "Date-time must be after the station is deployed.",
      )
      .required("Start date is required"),
    endDate: yup
      .date()
      .max(dayjs(Date.now()), "Date-time must be less than now.")
      .required("End date is required"),
  });

  const formik = useFormik({
    initialValues: {
      startDate: dayjs(deployedTime * 1000),
      endDate: dayjs(Date.now() * 1000),
    },

    validationSchema: MembersValidationSchema,

    onSubmit: async (values) => {
      setDownloadLoading(true);
      const membersData = await getAllEntities(
        SUBGRAPH_URL,
        daoAddress ? daoAddress : pid,
        "users",
        dayjs(values.startDate).unix(),
        dayjs(values.endDate).unix(),
      );
      const csvData = await convertDataToCSV(membersData); // Convert the membersData array to CSV format

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "members.csv");
      // Trigger the download with the file-saver library
      setDownloadLoading(false);
    },
  });
  console.log(formik);
  const convertDataToCSV = async (data) => {
    const rows = await Promise.all(
      data.map(async (item) => {
        const timestamp = new Date(+item.timeStamp * 1000);
        const date = timestamp.toLocaleDateString();
        const time = timestamp.toLocaleTimeString();
        return [
          item.userAddress,
          item.depositAmount,
          item.gtAmount,
          `${date} ${time}`,
        ].join(",");
      }),
    );
    const header = [
      "Member address",
      "Deposit amount",
      "Station tokens",
      "Joined on",
    ].join(",");

    return [header, ...rows].join("\n");
  };

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
              <Grid
                container
                spacing={3}
                style={{
                  display: "flex",
                  alignItems: "start",
                }}
                mb={4}>
                <Grid item style={{ display: "flex", flexDirection: "column" }}>
                  {console.log(formik.values.startDate)}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={formik.values.startDate}
                      minDateTime={dayjs(deployedTime * 1000)}
                      onChange={(value) => {
                        formik.setFieldValue("startDate", value);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.startDate &&
                        Boolean(formik.errors.startDate)
                      }
                      helperText={
                        formik.touched.startDate && formik.errors.startDate
                      }
                    />
                  </LocalizationProvider>
                  <Typography variant="caption" color="error">
                    {formik.touched.startDate && formik.errors.startDate}
                  </Typography>
                </Grid>
                <Grid item style={{ display: "flex", flexDirection: "column" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={formik.values.endDate}
                      maxDateTime={dayjs(Date.now())}
                      onChange={(value) => {
                        formik.setFieldValue("endDate", value);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.endDate && Boolean(formik.errors.endDate)
                      }
                      helperText={
                        formik.touched.endDate && formik.errors.endDate
                      }
                    />
                  </LocalizationProvider>
                  <Typography variant="caption" color="error">
                    {formik.touched.endDate && formik.errors.endDate}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={formik.handleSubmit}
                    style={{ height: "55px" }}>
                    {downloadLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Download CSV"
                    )}{" "}
                  </Button>
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
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={Members_Count}
                  rowsPerPage={20}
                  page={page}
                  onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
                />
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

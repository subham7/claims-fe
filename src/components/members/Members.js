import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  // Typography,
} from "@mui/material";
import { Typography, Button } from "@components/ui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { getAllEntities } from "utils/helper";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import { saveAs } from "file-saver";
import { useNetwork } from "wagmi";
import { queryPaginatedMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import { CHAIN_CONFIG } from "utils/constants";

const Members = ({ daoAddress }) => {
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const header = [
    "Member address",
    "Deposit amount",
    "Station tokens",
    "Joined on",
  ];

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
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
        const data = await queryPaginatedMembersFromSubgraph(
          daoAddress,
          20,
          0,
          deployedTime,
          Date.now(),
          networkId,
        );

        if (data?.users) setMembersData(data?.users);
      };

      if (daoAddress && networkId && deployedTime) fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [daoAddress, deployedTime, networkId]);

  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = async (event, newPage) => {
    try {
      setPage(newPage);
      const newSkip = newPage * rowsPerPage;
      const data = await queryPaginatedMembersFromSubgraph(
        daoAddress,
        20,
        newSkip,
        1685613616,
        Date.now(),
        networkId,
      );

      if (data.users) setMembersData(data?.users);
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
      startDate: deployedTime ? dayjs(deployedTime * 1000) : dayjs(Date.now()),
      endDate: dayjs(Date.now()),
    },

    validationSchema: MembersValidationSchema,

    onSubmit: async (values) => {
      setDownloadLoading(true);
      const membersData = await getAllEntities(
        CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
        daoAddress,
        "users",
        dayjs(values?.startDate).unix(),
        dayjs(values?.endDate).unix(),
      );
      const csvData = await convertDataToCSV(membersData); // Convert the membersData array to CSV format

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "members.csv");
      // Trigger the download with the file-saver library
      setDownloadLoading(false);
    },
  });

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
      <Grid container spacing={3}>
        <Grid item md={9} mb={8}>
          <Grid container mb={4}>
            <Grid item>
              <Typography variant="heading">Station Members</Typography>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={formik.values.startDate}
                  minDateTime={dayjs(deployedTime * 1000)}
                  onChange={(value) => {
                    formik.setFieldValue("startDate", value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.startDate && Boolean(formik.errors.startDate)
                  }
                  helperText={
                    formik.touched.startDate && formik.errors.startDate
                  }
                />
              </LocalizationProvider>
              <Typography variant="body" className="text-error">
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
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              </LocalizationProvider>
              <Typography variant="body" color="text-error">
                {formik.touched.endDate && formik.errors.endDate}
              </Typography>
            </Grid>
            <Grid item mt={1}>
              <Button onClick={formik.handleSubmit} variant="normal">
                {downloadLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Download CSV"
                )}
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 809 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {header?.map((data, key) => {
                    return (
                      <TableCell align="left" variant="tableHeading" key={key}>
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
                    <TableCell align="left">
                      <Typography variant="body" className="text-blue">
                        <Tooltip title={data.userAddress}>
                          <div
                            className="f-d f-v-c  f-gap-8 c-pointer"
                            onClick={(e) => {
                              handleAddressClick(e, data.userAddress);
                            }}>
                            {data.userAddress.substring(0, 8) +
                              "......" +
                              data.userAddress.substring(
                                data.userAddress.length - 4,
                              )}
                            <OpenInNewIcon style={{ marginBottom: "12px" }} />
                          </div>
                        </Tooltip>
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body">
                        {Number(
                          convertFromWeiGovernance(data.depositAmount, 6),
                        ).toFixed(2)}{" "}
                        USDC
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body">
                        {tokenType === "erc20"
                          ? Number(
                              convertFromWeiGovernance(data?.gtAmount, 18),
                            ).toFixed(2)
                          : data?.gtAmount}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body">
                        {new Date(+data.timeStamp * 1000).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={Members_Count ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme?.zIndex?.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default Members;

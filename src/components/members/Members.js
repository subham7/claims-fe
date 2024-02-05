import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
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
import { getAllEntities, isNative, shortAddress } from "utils/helper";
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
import { getDefaultProfile } from "utils/lensHelper";
import BackdropLoader from "@components/common/BackdropLoader";
import ComponentHeader from "@components/common/ComponentHeader";
import useCommonContractMethods from "hooks/useCommonContractMehods";

const Members = ({ daoAddress }) => {
  const { getDecimals, getTokenSymbol } = useCommonContractMethods();
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

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const [membersData, setMembersData] = useState([]);
  const [memberProfiles, setMemberProfiles] = useState();

  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    isNativeToken: false,
  });

  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const header = [
    "Member address",
    "Deposit amount",
    "Station tokens",
    "Joined on",
  ];

  const fetchTokenDetails = async () => {
    try {
      const depositTokenAddress = clubData.depositTokenAddress;
      const isNativeToken = isNative(clubData.depositTokenAddress, networkId);

      const decimals = isNativeToken
        ? 18
        : await getDecimals(depositTokenAddress);
      const symbol = isNativeToken
        ? CHAIN_CONFIG[networkId].nativeCurrency.symbol
        : await getTokenSymbol(depositTokenAddress);

      setTokenDetails({
        tokenSymbol: symbol,
        tokenDecimal: decimals,

        isNativeToken: isNativeToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, []);
  const handleAddressClick = (event, address) => {
    event.preventDefault();
    window.open(
      `${CHAIN_CONFIG[networkId].blockExplorerUrl}/address/${address}`,
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
          networkId,
        );

        if (data?.users) {
          setMembersData(data?.users);
          const memberAddresses = data?.users.map((item) => item.userAddress);

          const profiles = await getDefaultProfile(memberAddresses);

          const memberProfiles = new Map();
          memberAddresses.forEach((address) => {
            memberProfiles.set(
              address,
              profiles?.find(
                (profile) => profile.ownedBy.toLowerCase() === address,
              )?.handle,
            );
          });
          setMemberProfiles(memberProfiles);
        }
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
        networkId,
      );

      if (data?.users) {
        setMembersData(data?.users);
        const memberAddresses = data?.users.map((item) => item.userAddress);

        const profiles = await getDefaultProfile(memberAddresses);

        const memberProfiles = new Map();
        memberAddresses.forEach((address) => {
          memberProfiles.set(
            address,
            profiles.find(
              (profile) => profile.ownedBy.toLowerCase() === address,
            )?.handle,
          );
        });
        setMemberProfiles(memberProfiles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const MembersValidationSchema = yup.object({
    startDate: yup.date().required("Start date is required"),
    endDate: yup
      .date()
      .max(dayjs(Date.now()), "Date-time must be less than now.")
      .required("End date is required"),
  });

  const formik = useFormik({
    initialValues: {
      startDate: deployedTime
        ? dayjs(deployedTime * 1000)
        : dayjs(Date.now() - 86400000),
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
              <ComponentHeader
                title={"Station Members"}
                subtext="See all your members here on this very page"
              />
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
                      <TableCell
                        align="left"
                        variant="tableHeading"
                        key={key}
                        sx={{ fontFamily: "inherit" }}>
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
                      <Typography>
                        <Tooltip title={data.userAddress}>
                          <div
                            className="f-d f-v-c f-gap-8 c-pointer"
                            onClick={(e) => {
                              handleAddressClick(e, data.userAddress);
                            }}>
                            {memberProfiles?.has(data.userAddress) &&
                            memberProfiles?.get(data.userAddress) !== undefined
                              ? memberProfiles?.get(data.userAddress)
                              : shortAddress(data.userAddress)}
                            <OpenInNewIcon
                              sx={{
                                fontSize: "16px",
                              }}
                            />
                          </div>
                        </Tooltip>
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography
                        sx={{ fontSize: "14px !important", fontWeight: "400" }}>
                        {Number(
                          convertFromWeiGovernance(
                            data.depositAmount,
                            tokenDetails.tokenDecimal,
                          ),
                        ).toFixed(2)}{" "}
                        {tokenDetails.symbol}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography>
                        {tokenType === "erc20"
                          ? Number(
                              convertFromWeiGovernance(data?.gtAmount, 18),
                            ).toFixed(2)
                          : data?.gtAmount}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Typography>
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

      <BackdropLoader isOpen={loading} />
    </>
  );
};

export default Members;

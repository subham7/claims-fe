"use client";

import React, { useEffect, useState } from "react";
import classes from "./ConnectWallet.module.scss";
import { Skeleton, Typography } from "@mui/material";
import Footer from "../Footer/Footer";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getAnalyticsOfStationX } from "api/analytics";
import { formatNumbers } from "utils/helper";

const ConnectWallet = () => {
  const [analyticsData, setAnalyticsData] = useState();
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();

  const connectWalletHandler = async () => {
    await open();
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await getAnalyticsOfStationX();
    setAnalyticsData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.connectWalletSection}>
        <div className={classes.firstDiv}>
          <Typography className={classes.heading} variant="inherit">
            The Easiest Way to Manage <br />
            Collective Ownership in Web3
          </Typography>
          <Typography className={classes.subHeading} variant="inherit">
            Onchain capital coordination protocol built for syndicates, venture
            DAOs, asset managers and communities.
          </Typography>

          <button
            onClick={connectWalletHandler}
            className={classes.connectWalletButton}>
            Connect wallet
          </button>
        </div>

        <div className={classes.stationsInfo}>
          <div className={classes.info}>
            <Typography className={classes.value}>
              {loading ? (
                <Skeleton width={100} />
              ) : (
                formatNumbers(analyticsData?.totalStations?.total)
              )}
            </Typography>
            <Typography className={classes.title}>
              Total stations deployed
            </Typography>
          </div>
          <div className={classes.info}>
            <Typography className={classes.value}>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                `$${formatNumbers(analyticsData?.totalAmountRaised?.total)}`
              )}
            </Typography>
            <Typography className={classes.title}>
              Total volume of capital raised via stations
            </Typography>
          </div>
          <div className={classes.info}>
            <Typography className={classes.value}>
              {loading ? (
                <Skeleton width={100} />
              ) : (
                formatNumbers(analyticsData?.totalUniqueUsers?.total)
              )}
            </Typography>
            <Typography className={classes.title}>
              Total unique members
            </Typography>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConnectWallet;

import React, { useEffect, useState } from "react";
import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import { fetchClubByDaoAddress } from "api/club";
import Link from "next/link";

const DepositPreRequisites = ({ daoAddress }) => {
  const [depositConfig, setDepositConfig] = useState({});

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubByDaoAddress(daoAddress);
    setDepositConfig(res?.data?.depositConfig);
  };
  useEffect(() => {
    if (daoAddress) getDepositPreRequisites(daoAddress);
  }, [daoAddress]);

  return (
    <>
      {(depositConfig?.subscriptionDocId !== null ||
        depositConfig?.enableKyc === true ||
        depositConfig?.uploadDocId !== null) && (
        <div
          style={{
            marginTop: "20px",
          }}>
          <Typography>Complete these steps</Typography>
          {depositConfig?.subscriptionDocId !== null && (
            <Link
              href={`/documents/${daoAddress}/0x89/sign/${depositConfig?.subscriptionDocId}`}>
              <div className={classes.stepContainer}>
                <RadioButtonUncheckedIcon className={classes.icons} />
                <div style={{ marginRight: "0.5rem" }}>
                  Sign subscription agreement
                </div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            </Link>
          )}

          {depositConfig?.enableKyc ? (
            <div className={classes.stepContainer}>
              <RadioButtonUncheckedIcon className={classes.icons} />
              <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
              <OpenInNewIcon className={classes.icons} />
            </div>
          ) : null}

          {depositConfig?.uploadDocId !== null && (
            <div className={classes.stepContainer}>
              <RadioButtonUncheckedIcon className={classes.icons} />
              <div style={{ marginRight: "0.5rem" }}>Upload w8ben</div>
              <OpenInNewIcon className={classes.icons} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DepositPreRequisites;

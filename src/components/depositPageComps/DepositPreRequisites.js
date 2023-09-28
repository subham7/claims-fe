import React, { useEffect, useState } from "react";
import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import { fetchClubbyDaoAddress } from "api/club";

const DepositPreRequisites = ({ daoAddress }) => {
  const [depositConfig, setDepositConfig] = useState({});

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubbyDaoAddress(daoAddress);
    console.log("res", res);
    setDepositConfig(res?.data?.depositConfig);
  };
  useEffect(() => {
    if (daoAddress) getDepositPreRequisites(daoAddress);
  }, [daoAddress]);

  return (
    <>
      {depositConfig?.subscriptionDocId !== null &&
        depositConfig?.enableKyc === true &&
        depositConfig?.uploadDocId !== null && (
          <div>
            <Typography>Complete these steps</Typography>
            {depositConfig?.subscriptionDocId !== null && (
              <div className={classes.stepContainer}>
                <RadioButtonUncheckedIcon className={classes.icons} />
                <div style={{ marginRight: "0.5rem" }}>
                  Sign subscription agreement
                </div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            )}

            {depositConfig?.enableKyc === true && (
              <div className={classes.stepContainer}>
                <RadioButtonUncheckedIcon className={classes.icons} />
                <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            )}

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

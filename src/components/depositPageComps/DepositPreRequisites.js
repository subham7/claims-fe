import React, { useEffect, useState } from "react";
import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import { fetchClubbyDaoAddress } from "api/club";
import Link from "next/link";
import { useAccount } from "wagmi";
import { hasUserSigned } from "api/deposit";
import DoneIcon from "@mui/icons-material/Done";

const DepositPreRequisites = ({ daoAddress }) => {
  const { address: walletAddress } = useAccount();

  const [depositConfig, setDepositConfig] = useState({});
  const [isSigned, setIsSigned] = useState();

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubbyDaoAddress(daoAddress);
    setDepositConfig(res?.data?.depositConfig);
  };

  const userSigned = async (docIdentifier, walletAddress) => {
    const res = await hasUserSigned(docIdentifier, walletAddress);
    setIsSigned(res?.signature);
  };
  useEffect(() => {
    if (daoAddress) {
      getDepositPreRequisites(daoAddress);
      if (depositConfig?.subscriptionDocId !== null)
        userSigned(depositConfig?.subscriptionDocId, walletAddress);
    }
  }, [daoAddress, depositConfig?.subscriptionDocId, walletAddress]);

  return (
    <>
      {(depositConfig?.subscriptionDocId !== null ||
        depositConfig?.enableKyc === true ||
        depositConfig?.uploadDocId !== null) && (
        <div className={classes.mainContainer}>
          <Typography variant="subtitle1">Complete these steps</Typography>
          {depositConfig?.subscriptionDocId !== null && (
            <Link
              href={`/documents/${daoAddress}/0x89/sign/${depositConfig?.subscriptionDocId}`}>
              <div className={classes.stepContainer}>
                {isSigned ? (
                  <DoneIcon className={classes.tickIcon} />
                ) : (
                  <RadioButtonUncheckedIcon className={classes.icons} />
                )}

                <div style={{ marginRight: "0.5rem" }}>
                  Sign subscription agreement
                </div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            </Link>
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

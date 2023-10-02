import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import Link from "next/link";
import DoneIcon from "@mui/icons-material/Done";

const DepositPreRequisites = ({ daoAddress, depositConfig, isSigned }) => {
  return (
    <>
      {depositConfig &&
        (depositConfig?.subscriptionDocId !== null ||
          depositConfig?.enableKyc === true ||
          depositConfig?.uploadDocId !== null) && (
          <div className={classes.mainContainer}>
            <Typography variant="subtitle1">Complete these steps</Typography>
            {depositConfig?.subscriptionDocId !== null && (
              <Link
                style={{
                  display: "inline-block",
                }}
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

            {depositConfig && depositConfig?.enableKyc ? (
              <div className={classes.stepContainer}>
                <RadioButtonUncheckedIcon className={classes.icons} />
                <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            ) : null}

            {depositConfig && depositConfig?.uploadDocId !== null && (
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

import React from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import classes from "./ERC20.module.scss";
import { Typography } from "@components/ui";

const ERC20Details = ({
  clubData,
  erc20TokenDetails,
  isTokenGated,
  whitelistUserData,
}) => {
  return (
    <div className={classes.detailsContainer}>
      <div className={classes.flexContainer}>
        <div>
          <Typography variant="body" className="text-bold">
            Min. Deposit
          </Typography>
          <Typography variant="info">
            {convertFromWeiGovernance(
              clubData?.minDepositAmount,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </Typography>
        </div>

        <div>
          <Typography variant="body" className="text-bold">
            Max. Deposit
          </Typography>
          <Typography variant="info">
            {convertFromWeiGovernance(
              clubData?.maxDepositAmount,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </Typography>
        </div>

        <div>
          <Typography variant="body" className="text-bold">
            Token Price
          </Typography>
          <Typography variant="info">
            {convertFromWeiGovernance(
              clubData?.pricePerToken,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </Typography>
        </div>
      </div>

      <div className={classes.flexContainer}>
        <div>
          <Typography variant="body" className="text-bold">
            Control
          </Typography>
          <Typography variant="info">Admin(s)</Typography>
        </div>

        <div>
          <Typography variant="body" className="text-bold">
            Quorum
          </Typography>
          <Typography variant="info">
            {clubData?.isGovernanceActive ? `${clubData?.quorum}%` : "-"}
          </Typography>
        </div>

        <div>
          <Typography variant="body" className="text-bold">
            Threshold
          </Typography>
          <Typography variant="info">
            {clubData?.isGovernanceActive ? `${clubData?.threshold}%` : "-"}
          </Typography>
        </div>
      </div>

      {isTokenGated ||
      (whitelistUserData?.setWhitelist === true &&
        whitelistUserData?.proof === null) ? (
        <div className={classes.tokenGateInfo}>
          <BsInfoCircleFill color="#C1D3FF" />
          <p>
            This Station is token-gated. Please check the about section to know
            more.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ERC20Details;

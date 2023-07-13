import React from "react";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import classes from "./ERC20.module.scss";

const ERC20Details = ({ clubData, erc20TokenDetails }) => {
  return (
    <div className={classes.detailsContainer}>
      <div className={classes.flexContainer}>
        <div>
          <p className={classes.title}>Minium</p>
          <p>
            {convertFromWeiGovernance(
              clubData?.minDepositAmount,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </p>
        </div>

        <div>
          <p className={classes.title}>Maximum</p>
          <p>
            {convertFromWeiGovernance(
              clubData?.maxDepositAmount,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </p>
        </div>

        <div>
          <p className={classes.title}>Token Price</p>
          <p>
            {convertFromWeiGovernance(
              clubData?.pricePerToken,
              erc20TokenDetails?.tokenDecimal,
            )}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </p>
        </div>
      </div>

      <div className={classes.flexContainer}>
        <div>
          <p className={classes.title}>Control</p>
          <p>Admin(s)</p>
        </div>

        <div>
          <p className={classes.title}>Quorum</p>
          <p>{clubData?.isGovernanceActive ? `${clubData?.quorum}%` : "-"}</p>
        </div>

        <div>
          <p className={classes.title}>Threshold</p>
          <p>
            {clubData?.isGovernanceActive ? `${clubData?.threshold}%` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ERC20Details;

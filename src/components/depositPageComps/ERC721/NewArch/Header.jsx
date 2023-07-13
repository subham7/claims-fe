import React from "react";
import classes from "./ERC721.module.scss";
import ERC721Icons from "./ERC721Icons";

const Header = ({ clubData, clubInfo, active, isErc20 = true }) => {
  return (
    <>
      <p className={classes.heading}>{clubData?.name}</p>
      <div className={classes.flexContainer}>
        {active ? (
          <p className={classes.isActive}>
            <span className={classes.activeIllustration}></span>
            Active
          </p>
        ) : (
          <p className={classes.isInactive}>
            <span className={classes.executedIllustration}></span>
            Finished
          </p>
        )}
        <p className={classes.createdBy}>
          {`${clubData?.ownerAddress?.slice(
            0,
            5,
          )}...${clubData?.ownerAddress?.slice(-5)}`}
        </p>

        <ERC721Icons clubInfo={clubInfo} />
      </div>
      <p className={classes.smallText}>
        {isErc20 ? "Deposit Closes in" : "Minting closes in"}
      </p>

      <div className={classes.timer}>
        <p>00</p>
        <p>00</p>
        <p>00</p>
        <p>00</p>
      </div>
    </>
  );
};

export default Header;

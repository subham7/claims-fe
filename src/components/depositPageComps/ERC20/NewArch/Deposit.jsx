import Image from "next/image";
import React from "react";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import ProgressBar from "../../../progressbar";
import classes from "./ERC20.module.scss";
import { IoIosWallet } from "react-icons/io";

const Deposit = ({
  erc20TokenDetails,
  formik,
  remainingDays,
  remainingTimeInSecs,
  remainingClaimAmount,
  isEligibleForTokenGating,
  isTokenGated,
  clubData,
  whitelistUserData,
}) => {
  return (
    <div className={classes.rightContainer}>
      <div className={classes.flexContainer}>
        <p className={classes.subtitle}>Join this station</p>
        <div className={classes.balance}>
          <IoIosWallet size={22} />

          <p>
            {Number(erc20TokenDetails?.userBalance).toFixed(3)}{" "}
            {erc20TokenDetails?.tokenSymbol}
          </p>
        </div>
      </div>

      <div className={classes.inputContainer}>
        <input
          name="tokenInput"
          id="tokenInput"
          onChange={formik.handleChange}
          onWheel={(event) => event.target.blur()}
          autoFocus
          type={"number"}
        />

        <div className={classes.usdc}>
          <Image
            src="/assets/icons/usd.png"
            height={30}
            width={40}
            alt="USDC"
          />
          <p>{erc20TokenDetails?.tokenSymbol}</p>
        </div>
      </div>

      <p className={classes.errorText}>{formik.errors.tokenInput}</p>

      <button
        disabled={
          (remainingDays >= 0 && remainingTimeInSecs > 0 && isTokenGated
            ? !isEligibleForTokenGating
            : remainingDays >= 0 && remainingTimeInSecs > 0
            ? false
            : true) ||
          +clubData?.raiseAmount <= +clubData?.totalAmountRaised ||
          +remainingClaimAmount <= 0 ||
          (whitelistUserData?.setWhitelist === true &&
            whitelistUserData?.proof === null)
        }
        onClick={formik.handleSubmit}>
        Deposit
      </button>

      <p
        style={{
          marginBottom: "8px",
        }}
        className={classes.smallText}>
        {convertFromWeiGovernance(
          clubData?.totalAmountRaised,
          erc20TokenDetails.tokenDecimal,
        )}{" "}
        {erc20TokenDetails.tokenSymbol} out of{" "}
        {convertFromWeiGovernance(
          clubData?.raiseAmount,
          erc20TokenDetails?.tokenDecimal,
        )}{" "}
        {erc20TokenDetails.tokenSymbol} filled
      </p>
      <ProgressBar
        value={
          (Number(clubData?.totalAmountRaised) * 100) /
          Number(clubData?.raiseAmount)
        }
      />
    </div>
  );
};

export default Deposit;

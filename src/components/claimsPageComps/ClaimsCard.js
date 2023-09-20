import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { BsLink45Deg, BsFillSendFill } from "react-icons/bs";
import { AiFillCalendar } from "react-icons/ai";
import { FaCoins } from "react-icons/fa";
import { useRouter } from "next/router";
import Countdown from "react-countdown";
import { Alert } from "@mui/material";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import useCommonContractMethods from "hooks/useCommonContractMehods";

const useStyles = makeStyles({
  container: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    color: "white",
    cursor: "pointer",
  },
  topLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    alignItems: "center",
  },

  createdBy: {
    fontWeight: "300",
    margin: 0,
    fontSize: "14px",
    color: "#6475A3",
  },
  span: {
    color: "#dcdcdc",
  },
  icons: {
    padding: 4,
    border: "1px solid #FFFFFF1A",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  title: {
    margin: "10px 0",
    fontSize: "20px",
    fontWeight: "400",
    textAlign: "left",
  },
  para: {
    margin: 0,
    fontSize: "12px",
  },
  active: {
    padding: "4px 10px",
    background: "#17454E",
    color: "#0ABB91",
    border: "none",
    borderRadius: "5px",
  },
  inactive: {
    padding: "4px 10px",
    background: "#F75F71",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  countdown: {
    border: "1px solid #FFFFFF1A",
    padding: "8px",
    borderRadius: "5px",
    margin: 0,
  },
});

const ClaimsCard = ({
  description,
  i,
  airdropTokenAddress,
  totalAmount,
  updatedDate,
  startDate,
  endDate,
  claimContract,
  createdBy,
  isActive: active,
  claimsNetwork,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [isClaimStarted, setIsClaimStarted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);

  const { getDecimals, getTokenSymbol } = useCommonContractMethods();

  const startingTime = new Date(+startDate * 1000);
  const endingTime = new Date(+endDate * 1000);
  const convertedStartDay = new Date(startDate * 1000).getDate();
  const convertedStartMonth = new Date(startDate * 1000).toLocaleString(
    "default",
    { month: "short" },
  );
  const convertedEndDate = new Date(endDate * 1000).getDate();
  const convertedEndMonth = new Date(endDate * 1000).toLocaleString("default", {
    month: "short",
  });

  const convertedDate = new Date(updatedDate * 1000).toLocaleDateString();
  const currentTime = Date.now() / 1000;

  useEffect(() => {
    if (+startDate > currentTime) {
      setIsActive(false);
      setIsClaimStarted(false);
    } else if (+endDate < currentTime) {
      setIsActive(false);
      setIsClaimStarted(true);
    } else {
      setIsActive(true);
      setIsClaimStarted(true);
    }
  }, [currentTime, endDate, startDate]);

  const fetchContractDetails = async () => {
    try {
      setClaimEnabled(active);
      const tokenDecimals = await getDecimals(airdropTokenAddress);
      const tokenSymbol = await getTokenSymbol(airdropTokenAddress);

      setDecimals(tokenDecimals);
      setSymbol(tokenSymbol);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  });

  const claimHandler = () => {
    router.push(`/claims/${claimContract}`);
  };

  return (
    <div onClick={claimHandler} className={classes.container}>
      <div className={classes.topLine}>
        <h4 className={classes.createdBy}>
          Created by <span className={classes.span}>me</span> on{" "}
          <span className={classes.span}>{convertedDate}</span>
        </h4>
        <div className={classes.iconContainer}>
          {!isClaimStarted && (
            <p className={classes.countdown}>
              Starts in :
              <span style={{ marginLeft: "10px" }}>
                <Countdown date={startingTime} />
              </span>{" "}
            </p>
          )}
          <div
            className={`${
              isActive && claimEnabled ? classes.active : classes.inactive
            }`}>
            {isActive && isClaimStarted && claimEnabled
              ? "Active"
              : (!isActive && isClaimStarted) || !claimEnabled
              ? "Inactive"
              : !isActive && !isClaimStarted && "Not started yet"}
          </div>
          <BsLink45Deg
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                `${window.location.origin}/claim/${claimContract}/${claimsNetwork}`,
              );
              setIsCopied(true);

              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
            size={25}
            className={classes.icons}
          />
        </div>
      </div>

      <h2 className={classes.title}>
        <span className={classes.span}>#{i + 1} </span>
        {description}
      </h2>

      <div className={classes.iconContainer}>
        {/* Token */}
        <div className={classes.icons}>
          <BsFillSendFill color="#6475A3" size={12} />
          <p className={classes.para}>{symbol}</p>
        </div>

        {/* No. of Tokens */}
        <div className={classes.icons}>
          <FaCoins color="#6475A3" size={12} />
          <p className={classes.para}>
            {convertFromWeiGovernance(totalAmount, decimals)}
          </p>
        </div>

        {/* Date */}
        <div className={classes.icons}>
          <AiFillCalendar color="#6475A3" size={12} />
          <p className={classes.para}>
            {`${convertedStartDay} ${convertedStartMonth} - ${convertedEndDate} ${convertedEndMonth}`}
          </p>
        </div>
      </div>

      {isCopied && (
        <Alert
          severity="success"
          sx={{
            width: "150px",
            position: "absolute",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {"Copied"}
        </Alert>
      )}
    </div>
  );
};

export default ClaimsCard;

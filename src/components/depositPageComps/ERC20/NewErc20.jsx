import About from "@components/claims/About";
import ClaimActivity from "@components/claims/ClaimActivity";
import Eligibility from "@components/claims/Eligibility";
import Header from "@components/claims/Header";
import { Alert } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import classes from "../../../components/claims/Claim.module.scss";
import dayjs from "dayjs";
import SocialButtons from "@components/claims/SocialButtons";
import DepositInput from "./DepositInput";

const NewErc20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
  whitelistUserData,
  networkId,
}) => {
  const [generalInfo, setGeneralInfo] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  const [activityDetails, setActivityDetails] = useState({
    claimedAmt: "",
    address: "",
  });
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 6,
    tokenSymbol: "USDC",
    tokenAddress: "",
    whitelistTokenSymbol: "",
    whitelistTokenDecimal: 1,
  });
  const [members, setMembers] = useState([]);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);

  const fetchBannerDetails = async () => {
    try {
      //   const data = await getClaimDetails(claimAddress);
      setGeneralInfo(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActivities = async () => {
    try {
      const { users } = await queryLatestMembersFromSubgraph(
        daoAddress,
        networkId,
      );
      if (users) setMembers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (daoAddress) {
      fetchActivities();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <Header
            contractData={clubData}
            isActive={active}
            tokenDetails={tokenDetails}
            deadline={daoDetails.depositDeadline}
            isDeposit={true}
          />

          <DepositInput />
        </div>
        <SocialButtons isDeposit={true} data={clubInfo} />
      </section>
      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          {/* {generalInfo?.imageLinks?.banner ? ( */}
          <div className={classes.imageContainer}>
            <Image
              src={"/assets/images/claimsBanner.png"}
              fill
              alt="Banner Image"
            />
          </div>
          {/* ) : null} */}
        </div>

        {clubInfo?.bio && <About bio={clubInfo?.bio} />}

        {clubData && (
          <Eligibility isDeposit={true} isTokenGated={isTokenGated} />
        )}

        <ClaimActivity
          activityDetails={activityDetails}
          tokenDetails={tokenDetails}
        />
      </section>

      {showMessage ? (
        <Alert
          severity={claimed ? "success" : "error"}
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      ) : null}
    </main>
  );
};

export default NewErc20;

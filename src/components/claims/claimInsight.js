import React, { useEffect, useState } from "react";
import { ClaimsInsightStyles } from "@components/claimsInsightComps/claimsInsightStyles";
import TotalClaimedInfo from "@components/claimsInsightComps/TotalClaimedInfo";
import TotalWalletsClaimInfo from "@components/claimsInsightComps/TotalWalletsClaimInfo";
import ClaimDescriptionInfo from "@components/claimsInsightComps/ClaimDescriptionInfo";
import ClaimEligibility from "@components/claimsInsightComps/ClaimEligibility";
import ClaimEdit from "@components/claimsInsightComps/ClaimEdit";
import ToggleClaim from "@components/claimsInsightComps/ToggleClaim";
import ClaimsTransactions from "@components/claimsInsightComps/ClaimsTransactions";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import { useNetwork } from "wagmi";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { queryDropDetailsFromSubgraph } from "utils/dropsSubgraphHelper";
import { createSnapShot } from "api/claims";
import dayjs from "dayjs";
import CustomAlert from "@components/common/CustomAlert";

const ClaimInsight = ({ claimAddress }) => {
  const [claimsData, setClaimsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airdropTokenDetails, setAirdropTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenAddress: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessFull, setIsSuccessFull] = useState(false);

  const classes = ClaimsInsightStyles();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const { addMoreTokens, rollbackTokens, modifyStartAndEndTime } =
    useDropsContractMethods();

  const { getDecimals, getTokenSymbol, approveDeposit } =
    useCommonContractMethods();

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const { claims } = await queryDropDetailsFromSubgraph(
        claimAddress,
        networkId,
      );

      if (claims.length) setClaimsData(claims);

      const tokenDecimal = await getDecimals(claims[0].airdropToken);
      const tokenSymbol = await getTokenSymbol(claims[0].airdropToken);

      setAirdropTokenDetails({
        tokenDecimal,
        tokenSymbol,
        tokenAddress: claims[0].airdropToken,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addMoreTokensHandler = async (noOfTokens) => {
    setLoading(true);
    try {
      const amount = convertToWeiGovernance(
        noOfTokens,
        airdropTokenDetails?.tokenDecimal,
      );

      const remainingAmount = Number(
        convertFromWeiGovernance(
          claimsData[0].totalClaimAmount,
          airdropTokenDetails?.tokenDecimal,
        ) -
          Number(
            convertFromWeiGovernance(
              claimsData[0].totalAmountClaimed,
              airdropTokenDetails?.tokenDecimal,
            ),
          ),
      );

      let snapshotData;

      if (claimsData[0]?.claimType === "3") {
        snapshotData = await createSnapShot(
          convertToWeiGovernance(
            +noOfTokens + remainingAmount,
            airdropTokenDetails?.tokenDecimal,
          ),
          airdropTokenDetails.tokenAddress,
          claimsData[0]?.whitelistToken,
          claimsData[0]?.whitelistTokenNetwork, // token gated network
          claimsData[0]?.whitelistTokenBlockNum, // blockNumber
          networkId,
        );
      }

      await approveDeposit(
        airdropTokenDetails?.tokenAddress,
        claimAddress,
        noOfTokens,
        airdropTokenDetails?.tokenDecimal,
      );
      await addMoreTokens(
        claimAddress,
        amount,
        claimsData[0].claimType !== "3"
          ? claimsData[0].merkleRoot
          : snapshotData?.merkleRoot,
      );
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setMessage("Token added successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(false);
      if (error.code === 4001) {
        setMessage("Metamask Signature denied");
      } else setMessage("Adding token failed");
    }
  };

  const rollbackTokensHandler = async (amount, rollbackAddress) => {
    setLoading(true);
    try {
      const rollbackAmount = convertToWeiGovernance(
        amount,
        airdropTokenDetails?.tokenDecimal,
      );

      await rollbackTokens(claimAddress, rollbackAmount, rollbackAddress);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setMessage("Claimed successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(false);
      if (error.code === 4001) {
        setMessage("Metamask Signature denied");
      } else setMessage("Claiming token failed");
    }
  };

  const modifyStartAndEndTimeHandler = async (startTime, endTime) => {
    setLoading(true);
    try {
      await modifyStartAndEndTime(
        claimAddress,
        Number(startTime).toFixed(0),
        Number(endTime).toFixed(0),
      );
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setMessage("Modified time successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(false);
      if (error.code === 4001) {
        setMessage("Metamask Signature denied");
      } else setMessage("Modifying time failed");
    }
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  useEffect(() => {
    if (claimAddress && networkId) fetchClaimDetails();
  }, [claimAddress, networkId]);

  return (
    <>
      <section className={classes.mainContainer}>
        <div className={classes.claimInfoContainer}>
          <div className={classes.leftContainer}>
            <ClaimDescriptionInfo
              description={claimsData[0]?.description}
              endTime={claimsData[0]?.endTime}
              startTime={claimsData[0]?.startTime}
              claimAddress={claimAddress}
              isActive={claimsData[0]?.isActive}
              claimsNetwork={claimsData[0]?.networkId}
            />
            <div className={classes.infoBottomContainer}>
              <TotalClaimedInfo
                airdropTokenDetails={airdropTokenDetails}
                totalAmountClaimed={claimsData[0]?.totalAmountClaimed}
                totalClaimAmount={claimsData[0]?.totalClaimAmount}
                endTime={claimsData[0]?.endTime}
                claimType={claimsData[0]?.claimType}
              />
              <TotalWalletsClaimInfo
                numOfUsersClaimed={claimsData[0]?.numOfUsersClaimed}
                maxClaimableAmount={claimsData[0]?.maxClaimableAmount}
                airdropTokenDetails={airdropTokenDetails}
                totalUsers={claimsData[0]?.totalUsers}
              />
            </div>
          </div>
          <div className={classes.rightContainer}>
            <ToggleClaim
              claimAddress={claimAddress}
              isActive={claimsData[0]?.isActive}
            />
            <ClaimEdit
              addMoreTokensHandler={addMoreTokensHandler}
              rollbackTokensHandler={rollbackTokensHandler}
              airdropTokenDetails={airdropTokenDetails}
              modifyStartAndEndTimeHandler={modifyStartAndEndTimeHandler}
              endTime={dayjs(Number(claimsData[0]?.endTime) * 1000)}
              startTime={dayjs(Number(claimsData[0]?.startTime) * 1000)}
              hasAllowanceMechanism={claimsData[0]?.hasAllowanceMechanism}
            />
            <ClaimEligibility
              whitelistTokenAddress={claimsData[0]?.whitelistToken}
              minWhitelistTokenValue={claimsData[0]?.minWhitelistTokenValue}
            />
          </div>
        </div>

        <ClaimsTransactions
          airdropTokenDetails={airdropTokenDetails}
          claimAddress={claimAddress}
          maxClaimAmount={claimsData[0]?.maxClaimableAmount}
        />
      </section>

      {showMessage ? (
        <CustomAlert alertMessage={message} severity={isSuccessFull} />
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default ClaimInsight;

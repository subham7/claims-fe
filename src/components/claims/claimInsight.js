import React, { useEffect, useState } from "react";
import TotalClaimedInfo from "@components/claimsInsightComps/TotalClaimedInfo";
import TotalWalletsClaimInfo from "@components/claimsInsightComps/TotalWalletsClaimInfo";
import ClaimDescriptionInfo from "@components/claimsInsightComps/ClaimDescriptionInfo";
import ClaimEligibility from "@components/claimsInsightComps/ClaimEligibility";
import ClaimEdit from "@components/claimsInsightComps/ClaimEdit";
import ToggleClaim from "@components/claimsInsightComps/ToggleClaim";
import ClaimsTransactions from "@components/claimsInsightComps/ClaimsTransactions";
import { QUERY_CLAIM_DETAILS } from "api/graphql/queries";
import { Alert, Backdrop, CircularProgress } from "@mui/material";
import useSmartContractMethods from "hooks/useSmartContractMethods";
import useSmartContract from "hooks/useSmartContract";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { ClaimsInsightStyles } from "@components/claimsInsightComps/claimsInsightStyles";
import { subgraphQuery } from "utils/subgraphs";
import { CLAIMS_SUBGRAPH_URL_POLYGON } from "api";

const ClaimInsight = (claimAddress) => {
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

  useSmartContract({ claimAddress });

  const {
    getDecimals,
    getTokenSymbol,
    addMoreTokens,
    rollbackTokens,
    approveDeposit,
    modifyStartAndEndTime,
  } = useSmartContractMethods();

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const { claims } = await subgraphQuery(
        CLAIMS_SUBGRAPH_URL_POLYGON,
        QUERY_CLAIM_DETAILS(claimAddress),
      );
      setClaimsData(claims);

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
      await approveDeposit(
        airdropTokenDetails?.tokenAddress,
        claimAddress,
        noOfTokens,
        airdropTokenDetails?.tokenDecimal,
      );
      await addMoreTokens(amount);
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

      await rollbackTokens(rollbackAmount, rollbackAddress);
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
    if (claimAddress) fetchClaimDetails();
  }, [claimAddress]);

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
            <ToggleClaim isActive={claimsData[0]?.isActive} />
            <ClaimEdit
              addMoreTokensHandler={addMoreTokensHandler}
              rollbackTokensHandler={rollbackTokensHandler}
              airdropTokenDetails={airdropTokenDetails}
              modifyStartAndEndTimeHandler={modifyStartAndEndTimeHandler}
              endTime={claimsData[0]?.endTime}
              startTime={claimsData[0]?.startTime}
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

      {showMessage && isSuccessFull && (
        <Alert
          severity="success"
          sx={{
            width: "300px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      )}

      {showMessage && !isSuccessFull && (
        <Alert
          severity="error"
          sx={{
            width: "300px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ClaimInsight;

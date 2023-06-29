import React, { useEffect, useState } from "react";
import { ClaimsInsightStyles } from "../../../src/components/claimsInsightComps/claimsInsightStyles";
import Layout1 from "../../../src/components/layouts/layout1";
import TotalClaimedInfo from "../../../src/components/claimsInsightComps/TotalClaimedInfo";
import TotalWalletsClaimInfo from "../../../src/components/claimsInsightComps/TotalWalletsClaimInfo";
import ClaimDescriptionInfo from "../../../src/components/claimsInsightComps/ClaimDescriptionInfo";
import ClaimEligibility from "../../../src/components/claimsInsightComps/ClaimEligibility";
import ClaimEdit from "../../../src/components/claimsInsightComps/ClaimEdit";
import ToggleClaim from "../../../src/components/claimsInsightComps/ToggleClaim";
import ClaimsTransactions from "../../../src/components/claimsInsightComps/ClaimsTransactions";
import { useRouter } from "next/router";
import { subgraphQuery } from "../../../src/utils/subgraphs";
import { CLAIMS_SUBGRAPH_URL_GOERLI } from "../../../src/api";
import { QUERY_CLAIM_DETAILS } from "../../../src/api/graphql/queries";
import { Backdrop, CircularProgress } from "@mui/material";
import useSmartContractMethods from "../../../src/hooks/useSmartContractMethods";
import useSmartContract from "../../../src/hooks/useSmartContract";
import { convertToWeiGovernance } from "../../../src/utils/globalFunctions";

const ClaimInsight = () => {
  const [claimsData, setClaimsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airdropTokenDetails, setAirdropTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenAddress: "",
  });

  const classes = ClaimsInsightStyles();
  const router = useRouter();
  const { claimInsight: claimAddress } = router.query;

  useSmartContract();
  const {
    getDecimals,
    getTokenSymbol,
    addMoreTokens,
    rollbackTokens,
    claimBalance,
    claimSettings,
    modifyStartAndEndTime,
  } = useSmartContractMethods();

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const { claims } = await subgraphQuery(
        CLAIMS_SUBGRAPH_URL_GOERLI,
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

      await addMoreTokens(amount);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const rollbackTokensHandler = async (amount, rollbackAddress) => {
    setLoading(true);
    try {
      const rollbackAmount = convertToWeiGovernance(
        amount,
        airdropTokenDetails?.tokenDecimal,
      );

      const data = await claimBalance();
      const res = await claimSettings();

      console.log("c", data);
      console.log("c", res);

      console.log("AMount,", rollbackAmount);
      await rollbackTokens(rollbackAmount, rollbackAddress);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const modifyStartAndEndTimeHandler = async (startTime, endTime) => {
    setLoading(true);
    try {
      await modifyStartAndEndTime(startTime, endTime);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (claimAddress) fetchClaimDetails();
  }, [claimAddress]);

  return (
    <Layout1 showSidebar={false}>
      <section className={classes.mainContainer}>
        <div className={classes.claimInfoContainer}>
          <div className={classes.leftContainer}>
            <ClaimDescriptionInfo
              description={claimsData[0]?.description}
              endTime={claimsData[0]?.endTime}
              startTime={claimsData[0]?.startTime}
              claimAddress={claimAddress}
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
              startTime={claimsData[0]?.startTime}
              endTime={claimsData[0]?.endTime}
            />
            <ClaimEdit
              addMoreTokensHandler={addMoreTokensHandler}
              rollbackTokensHandler={rollbackTokensHandler}
              airdropTokenDetails={airdropTokenDetails}
              modifyStartAndEndTimeHandler={modifyStartAndEndTimeHandler}
              endTime={claimsData[0]?.endTime}
              startTime={claimsData[0]?.startTime}
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout1>
  );
};

export default ClaimInsight;

import React from "react";
import { ClaimsInsightStyles } from "../../../src/components/claimsInsightComps/claimsInsightStyles";
import Layout1 from "../../../src/components/layouts/layout1";
import TotalClaimedInfo from "../../../src/components/claimsInsightComps/TotalClaimedInfo";
import TotalWalletsClaimInfo from "../../../src/components/claimsInsightComps/TotalWalletsClaimInfo";
import ClaimDescriptionInfo from "../../../src/components/claimsInsightComps/ClaimDescriptionInfo";
import ClaimEligibility from "../../../src/components/claimsInsightComps/ClaimEligibility";
import ClaimEdit from "../../../src/components/claimsInsightComps/ClaimEdit";
import ToggleClaim from "../../../src/components/claimsInsightComps/ToggleClaim";
import ClaimsTransactions from "../../../src/components/claimsInsightComps/ClaimsTransactions";

const ClaimInsight = () => {
  const classes = ClaimsInsightStyles();
  return (
    <Layout1 showSidebar={false}>
      <section className={classes.mainContainer}>
        <div className={classes.claimInfoContainer}>
          <div className={classes.leftContainer}>
            <ClaimDescriptionInfo />
            <div className={classes.infoBottomContainer}>
              <TotalClaimedInfo />
              <TotalWalletsClaimInfo />
            </div>
          </div>
          <div className={classes.rightContainer}>
            <ToggleClaim />
            <ClaimEdit />
            <ClaimEligibility />
          </div>
        </div>

        <ClaimsTransactions />
      </section>
    </Layout1>
  );
};

export default ClaimInsight;

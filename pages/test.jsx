import ComponentHeader from "@components/common/ComponentHeader";
import Layout from "@components/layouts/layout";
import React, { useState } from "react";
import classes from "../src/components/(proposal)/Proposal.module.scss";
import ProposalTabs from "@components/(proposal)/ProposalTabs";
import { Typography } from "@mui/material";
import ProposalItem from "@components/(proposal)/ProposalItem";

const Proposal = () => {
  const [tabType, setTabType] = useState("Queue");

  const tabChangeHandler = (event, newValue) => {
    setTabType(newValue);
  };

  return (
    <Layout showSidebar>
      <div className={classes.proposalPageContainer}>
        <div className={classes.leftContainer}>
          <ComponentHeader
            title={"Actions"}
            subtext={""}
            showButton={true}
            buttonText="Create Action"
            onClickHandler={() => {
              console.log("xx");
            }}
          />

          <ProposalTabs onChange={tabChangeHandler} tabType={tabType} />

          {tabType === "Queue" ? (
            <div>
              <div className={classes.nextProposalContainer}>
                <Typography
                  fontFamily={"inherit"}
                  fontSize={12}
                  sx={{
                    textTransform: "uppercase",
                  }}
                  color={"#707070"}>
                  Next
                </Typography>
                <ProposalItem type={"sign"} note={"Hello there"} />
              </div>

              <Typography
                paddingTop={4}
                fontFamily={"inherit"}
                fontSize={12}
                sx={{
                  textTransform: "uppercase",
                }}
                color={"#707070"}>
                Execute later
              </Typography>
              <ProposalItem type={"sign"} />
              <ProposalItem type={"sign"} />
              <ProposalItem type={"sign"} />
            </div>
          ) : (
            <div>
              <ProposalItem type={"executed"} />
              <ProposalItem type={"executed"} note={"Hello"} />
            </div>
          )}
        </div>

        <div className={classes.rightContainer}>
          <div className={classes.infoContainer}>
            <Typography variant="inherit" fontSize={16} fontWeight={600}>
              What&apos;s an action?
            </Typography>
            <Typography variant="inherit" fontSize={15} color={"#707070"}>
              Each action helps you get done with day-to-day stuff inside your
              station. Please begin by executing the top most action in the
              queue.
            </Typography>
          </div>

          <div className={classes.signersContainer}>
            <div className={classes.heading}>
              <Typography variant="inherit" fontSize={16} fontWeight={600}>
                Treasury admins
              </Typography>

              <Typography variant="inherit" fontSize={14} color={"#707070"}>
                Signers{" "}
                <span style={{ color: "white", marginLeft: "4px" }}>3</span>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proposal;

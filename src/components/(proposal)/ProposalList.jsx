import React, { useEffect, useState } from "react";
import classes from "@components/(proposal)/Proposal.module.scss";

import ProposalTabs from "./ProposalTabs";
import { Pagination, Skeleton, Typography } from "@mui/material";
import ProposalItem from "./ProposalItem";
import {
  getLatesExecutableProposal,
  getPaginatedProposalList,
} from "api/proposal";
import ExecutedProposalList from "./ExecutedProposalList";
import PassedProposalList from "./PassedProposalList";

export const PropsalLoadingShimmer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton
          key={item}
          height={120}
          sx={{
            minWidth: "68vw",
          }}
        />
      ))}
    </div>
  );
};

const ProposalList = ({ daoAddress, routeNetworkId }) => {
  const [tabType, setTabType] = useState("Queue");
  const [executedProposals, setExecutedProposals] = useState([]);
  const [passedProposals, setPassedProposals] = useState([]);
  const [executableProposal, setExecutableProposal] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const limit = 10;
  const pageCount = Math.ceil(totalCount / limit);

  const tabChangeHandler = (event, newValue) => {
    setTabType(newValue);
    setPage(1);
  };

  useEffect(() => {
    const loadSignedProposals = async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await getPaginatedProposalList(daoAddress, limit, offset);
      setPassedProposals(data?.data?.data || []);
      setTotalCount(data?.data?.total);
      setLoading(false);
    };

    const loadExecutedProposals = async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await getPaginatedProposalList(
        daoAddress,
        limit,
        offset,
        "executed",
      );
      setExecutedProposals(data?.data?.data || []);
      setTotalCount(data?.data?.total);
      setLoading(false);
    };

    const loadExecutableLatestProposal = async () => {
      const data = await getLatesExecutableProposal(daoAddress);
      setExecutableProposal(data?.data[0]);
    };

    if (tabType === "Queue") {
      loadSignedProposals();
      loadExecutableLatestProposal();
    } else {
      loadExecutedProposals();
    }
  }, [page, tabType]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
      <ProposalTabs onChange={tabChangeHandler} tabType={tabType} />

      {tabType === "Queue" ? (
        <div>
          {executableProposal ? (
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
              <ProposalItem
                daoAddress={daoAddress}
                executionId={executableProposal?.commands[0].executionId}
                proposal={executableProposal}
                routeNetworkId={routeNetworkId}
                type={"execute"}
              />
            </div>
          ) : null}
          <>
            <Typography
              // paddingTop={4}
              fontFamily={"inherit"}
              fontSize={12}
              sx={{
                textTransform: "uppercase",
              }}
              color={"#707070"}>
              Execute later
            </Typography>

            {loading ? (
              <div
                style={{
                  width: "fit-content",
                  margin: "20px auto",
                }}>
                <PropsalLoadingShimmer />
              </div>
            ) : (
              <PassedProposalList
                daoAddress={daoAddress}
                routeNetworkId={routeNetworkId}
                passedProposals={passedProposals}
              />
            )}
          </>
        </div>
      ) : (
        <>
          {loading ? (
            <div
              style={{
                width: "fit-content",
                margin: "20px auto",
                minHeight: "50vh",
              }}>
              <PropsalLoadingShimmer />
            </div>
          ) : (
            <ExecutedProposalList
              daoAddress={daoAddress}
              routeNetworkId={routeNetworkId}
              executedProposals={executedProposals}
            />
          )}
        </>
      )}

      {!loading && (
        <Pagination
          style={{
            alignSelf: "flex-end",
          }}
          variant="outlined"
          count={pageCount}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProposalList;

import classes from "@components/(proposal)/Proposal.module.scss";
import ProposalTabs from "./ProposalTabs";
import { Pagination, Skeleton, Typography } from "@mui/material";
import ProposalItem from "./ProposalItem";
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

const ProposalList = ({
  daoAddress,
  routeNetworkId,
  tabType,
  setTabType,
  page,
  setPage,
  loading,
  executableProposal,
  passedProposals,
  executedProposals,
  refreshProposals,
  totalCount,
  limit,
}) => {
  const pageCount = Math.ceil(totalCount / limit);

  const tabChangeHandler = (event, newValue) => {
    setTabType(newValue);
    setPage(1);
  };

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
                onProposalUpdate={refreshProposals}
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
                onProposalUpdate={refreshProposals}
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
              onProposalUpdate={refreshProposals}
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

import React, { useEffect, useState } from "react";
import ComponentHeader from "@components/common/ComponentHeader";
import classes from "@components/(proposal)/Proposal.module.scss";
import { Typography } from "@mui/material";
import ProposalSigners from "./ProposalSigners";
import ProposalList from "./ProposalList";
import Link from "next/link";
import ProposalActionModal from "@components/modals/ProposalActionModal/ProposalActionModal";
import { useSelector } from "react-redux";
import ActionModal from "@components/dashboardComps/dashboardActions/ActionModal";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import MintModal from "@components/modals/ProposalActionModal/MintModal";
import { useRouter } from "next/router";
import {
  getLatesExecutableProposal,
  getPaginatedProposalList,
} from "api/proposal";

const ProposalSection = ({ daoAddress, routeNetworkId }) => {
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showSendAssetsModal, setShowSendAssetsModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [isActionCreated, setIsActionCreated] = useState(null);
  const [tabType, setTabType] = useState("Queue");
  const [executedProposals, setExecutedProposals] = useState([]);
  const [passedProposals, setPassedProposals] = useState([]);
  const [executableProposal, setExecutableProposal] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [isRouteRequire, setIsRouteRequire] = useState();
  const limit = 10;
  const router = useRouter();
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });
  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const refreshProposals = async () => {
    if (tabType === "Queue") {
      await loadSignedProposals();
      await loadExecutableLatestProposal();
    } else {
      await loadExecutedProposals();
    }
  };

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

  const handleActionComplete = (result, proposalId = "", isRefreshList) => {
    setShowSendAssetsModal(false);
    setShowDistributeModal(false);
    setShowMintModal(false);
    setIsRouteRequire(!isRefreshList);
    setIsActionCreated(result);
    if (isRefreshList) refreshProposals();
  };

  useEffect(() => {
    if (tabType === "Queue") {
      loadSignedProposals();
      loadExecutableLatestProposal();
    } else {
      loadExecutedProposals();
    }
  }, [page, tabType]);

  return (
    <div className={classes.proposalPageContainer}>
      <div className={classes.leftContainer}>
        <ComponentHeader
          title={"Actions"}
          subtext={""}
          showButton={true}
          buttonText="Create Action"
          onClickHandler={() => {
            setShowActionsModal(true);
          }}
        />

        <ProposalList
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
          tabType={tabType}
          setTabType={setTabType}
          executableProposal={executableProposal}
          executedProposals={executedProposals}
          passedProposals={passedProposals}
          loading={loading}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          limit={limit}
          refreshProposals={refreshProposals}
        />
      </div>

      <div className={classes.rightContainer}>
        <div className={classes.infoContainer}>
          <Typography variant="inherit" fontSize={16} fontWeight={600}>
            What&apos;s an action?
          </Typography>
          <Typography variant="inherit" fontSize={15} color={"#707070"}>
            Actions help you manage the day-to-day activities inside your
            station.{" "}
            <Link
              style={{
                color: "#2196f3",
                textDecoration: "underline",
              }}
              target="_blank"
              href={
                "https://stationxnetwork.gitbook.io/docs/managing-a-station/workflows-and-automations"
              }>
              Learn More
            </Link>
            <br />
            <br /> Please begin by executing the top most action in the queue.
          </Typography>
        </div>

        <ProposalSigners
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
        />
      </div>

      {showActionsModal && (
        <ProposalActionModal
          setShowActionModal={setShowActionsModal}
          setShowSendAssetsModal={setShowSendAssetsModal}
          setShowDistributeModal={setShowDistributeModal}
          setShowMintModal={setShowMintModal}
        />
      )}

      {showSendAssetsModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          onClose={() => setShowSendAssetsModal(false)}
          type={"send"}
          onActionComplete={handleActionComplete}
        />
      )}

      {showDistributeModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          onClose={() => setShowDistributeModal(false)}
          onActionComplete={handleActionComplete}
          type={"distribute"}
        />
      )}

      {showMintModal && (
        <MintModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          tokenType={tokenType}
          onClose={() => setShowMintModal(false)}
          onActionComplete={handleActionComplete}
          isGovernanceActive={isGovernanceActive}
        />
      )}

      {isActionCreated === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setIsActionCreated(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            if (isRouteRequire) {
              router.push(`/proposals/${daoAddress}/${routeNetworkId}`);
            } else {
              setIsActionCreated(null);
            }
          }}
        />
      ) : isActionCreated === "failure" ? (
        <StatusModal
          heading={"Something went wrong"}
          subheading="Looks like we hit a bump here, try again?"
          isError={true}
          onClose={() => {
            setIsActionCreated(null);
          }}
          buttonText="Try Again?"
          onButtonClick={() => {
            setIsActionCreated(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default ProposalSection;

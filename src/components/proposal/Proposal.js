import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { proposalDisplayOptions } from "data/dashboard";
import DocsCard from "@components/common/DocsCard";
import { fetchProposals } from "utils/proposal";
import { useRouter } from "next/router";
import ProposalCard from "./ProposalCard";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Web3 from "web3";
import { getProposalByDaoAddress, getProposalTxHash } from "api/proposal";
import { getSafeSdk } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import { useAccount, useNetwork } from "wagmi";
import BackdropLoader from "@components/common/BackdropLoader";
import SelectActionDialog from "@components/proposalComps/SelectActionDialog";
import ComponentHeader from "@components/common/ComponentHeader";

const useStyles = makeStyles({
  noProposal_heading: {
    fontSize: "18px",
    fontWeight: "400",
    color: "white",
    marginBottom: "10px",
  },
  noProposal_para: {
    fontSize: "14px",
    fontWeight: "400",
    color: "lightgray",
  },
  noProposal: {
    width: "100%",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "30px 30px",
  },
  headerDiv: {
    display: "flex",
    width: "100%",
    gap: "16px",
    marginBottom: "20px",
  },
  proposeBtn: {
    paddingLeft: "40px !important",
    paddingRight: "40px !important",
  },
});

const Proposal = ({ daoAddress }) => {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address: walletAddress } = useAccount();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = useStyles();

  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );

  const [open, setOpen] = useState(false);

  const [proposalList, setProposalList] = useState([]);
  const [owners, setOwners] = useState([]);

  const { gnosisAddress, tokenType } = useSelector((state) => {
    return state.club.clubData;
  });

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const {
    threshold: ERC721_Threshold,
    quorum: ERC721_Quorum,
    isGovernanceActive: isGovernanceERC721,
  } = useSelector((state) => {
    return state.club.erc721ClubDetails;
  });

  const {
    threshold: ERC20_Threshold,
    quorum: ERC20_Quorum,
    isGovernanceActive: isGovernanceERC20,
  } = useSelector((state) => {
    return state.club.erc20ClubDetails;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const Club_Threshold =
    tokenType === "erc20" ? ERC20_Threshold : ERC721_Threshold;

  const Club_Quorum = tokenType === "erc20" ? ERC20_Quorum : ERC721_Quorum;

  const [executionTransaction, setExecutionTransaction] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/${proposal?.proposalId}`, undefined, {
      shallow: true,
    });
  };

  const fetchProposalList = async (type = "all") => {
    const data = await fetchProposals(daoAddress, type);
    setProposalList(data);
  };

  const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedListItem(value);
    fetchProposalList(value);
  };

  const getExecutionTransaction = async () => {
    try {
      const { safeService } = await getSafeSdk(
        "",
        walletAddress,
        CHAIN_CONFIG[networkId].gnosisTxUrl,
        networkId,
      );
      const proposalData = getProposalByDaoAddress(daoAddress);
      const pendingTxs = await safeService.getPendingTransactions(
        Web3.utils.toChecksumAddress(gnosisAddress),
      );
      const count = pendingTxs.count;
      proposalData.then(async (result) => {
        Promise.all(
          result.data.map(async (proposal) => {
            const proposalTxHash = await getProposalTxHash(proposal.proposalId);
            if (proposalTxHash.data[0]) {
              proposal["safeTxHash"] = proposalTxHash?.data[0].txHash;
              if (
                proposalTxHash.data[0].txHash ===
                pendingTxs?.results[count - 1]?.safeTxHash
              ) {
                setExecutionTransaction(proposal);
              }
            }
          }),
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchOwners = async () => {
    try {
      const { safeSdk } = await getSafeSdk(
        gnosisAddress,
        walletAddress,
        CHAIN_CONFIG[networkId].gnosisTxUrl,
        networkId,
      );
      const addresses = [];
      const ownerAddresses = await safeSdk?.getOwners();
      ownerAddresses.map((owner) => {
        addresses.push({
          title: owner,
        });
      });
      setOwners(addresses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoaderOpen(true);
    if (gnosisAddress && walletAddress) {
      fetchOwners();

      getExecutionTransaction();
      setLoaderOpen(false);
    }
    setLoaderOpen(false);
  }, [gnosisAddress, walletAddress]);

  useEffect(() => {
    fetchProposalList();
  }, [daoAddress]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={9}>
          <Grid container>
            <div className={classes.headerDiv}>
              <ComponentHeader
                title={"Activity"}
                subtext="Use actions to get done with your day-to-day stuff directly from the station 🛸"
                showButton={isGovernanceActive || isAdminUser}
                buttonText="Propose"
                onClickHandler={handleClickOpen}
              />
              {/* 
              <Select
                sx={{ textTransform: "capitalize" }}
                value={selectedListItem}
                onChange={handleFilterChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return "Select a command";
                  }
                  return selected;
                }}
                MenuProps={proposalDisplayOptions}
                style={{
                  borderRadius: "10px",
                  background: "#111111 0% 0% no-repeat padding-box",
                  width: "25%",
                }}>
                {proposalDisplayOptions.map((option) => (
                  <MenuItem
                    key={option.name}
                    value={option.type}
                    sx={{ textTransform: "capitalize" }}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select> */}
            </div>
            <Grid container spacing={3}>
              {proposalList?.length > 0 ? (
                <>
                  {executionTransaction && (
                    <>
                      <Grid item>
                        <h2>Queued Transactions</h2>
                      </Grid>
                      <Grid
                        item
                        onClick={(e) => {
                          handleProposalClick(executionTransaction);
                        }}
                        md={12}>
                        <ProposalCard
                          proposal={executionTransaction}
                          executionTransaction={true}
                          daoAddress={daoAddress}
                        />
                      </Grid>
                    </>
                  )}
                  {executionTransaction && (
                    <Grid item>
                      <h2>Proposals</h2>
                    </Grid>
                  )}
                  {proposalList.map((proposal, key) => {
                    return (
                      <Grid
                        item
                        key={proposal.id}
                        onClick={(e) => {
                          handleProposalClick(proposalList[key]);
                        }}
                        md={12}>
                        <ProposalCard
                          proposal={proposal}
                          indexKey={key}
                          daoAddress={daoAddress}
                        />
                      </Grid>
                    );
                  })}
                </>
              ) : (
                <Grid item width={"100%"}>
                  <div className={classes.noProposal}>
                    <p className={classes.noProposal_heading}>
                      No Proposals found
                    </p>
                    <p className={classes.noProposal_para}>
                      Past proposals appear here.
                    </p>
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <div className={classes.sticky}>
            <DocsCard
              heading="Signator(s)"
              data={owners}
              isGovernance={false}
            />
            <DocsCard
              heading="Governance"
              data={[
                {
                  title: "Quorum",
                  value: Club_Quorum,
                },
                {
                  title: "Threshold",
                  value: Club_Threshold,
                },
              ]}
              isGovernance
            />
          </div>
        </Grid>
      </Grid>

      <SelectActionDialog
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        daoAddress={daoAddress}
        networkId={networkId}
      />
      <BackdropLoader isOpen={open} />
    </>
  );
};

export default Proposal;

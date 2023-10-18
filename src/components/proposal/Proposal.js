import React, { useCallback, useEffect, useState } from "react";
import { Grid, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Button, Typography } from "@components/ui";
import { proposalDisplayOptions } from "data/dashboard";
import DocsCard from "@components/proposalComps/DocsCard";
import CreateProposalDialog from "@components/proposalComps/CreateProposalDialog";
import { fetchProposals } from "utils/proposal";
import { useRouter } from "next/router";
import ProposalCard from "./ProposalCard";
import { getNFTsByDaoAddress } from "api/assets";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { getProposalByDaoAddress, getProposalTxHash } from "api/proposal";
import { getUserTokenData, web3InstanceCustomRPC } from "utils/helper";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { getTokensList } from "api/token";
import { CHAIN_CONFIG } from "utils/constants";
import { useNetwork } from "wagmi";
import BackdropLoader from "@components/common/BackdropLoader";

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
    marginTop: "50px",
  },
});

const Proposal = ({ daoAddress }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = useStyles();

  const [nftData, setNftData] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );

  const [open, setOpen] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [proposalList, setProposalList] = useState([]);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

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

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(gnosisAddress, networkId);
      setNftData(nftsData?.data);
      dispatch(addNftsOwnedByDao(nftsData?.data));
    } catch (error) {
      console.log(error);
    }
  }, [networkId, dispatch, gnosisAddress]);

  const fetchTokens = useCallback(async () => {
    if (daoAddress && gnosisAddress && networkId) {
      const tokensList = await getTokensList(
        CHAIN_CONFIG[networkId].covalentNetworkName,
        gnosisAddress,
      );
      const data = await getUserTokenData(
        tokensList?.data?.items,
        networkId,
        true,
      );

      setTokenData(data?.filter((token) => token.symbol !== null));
    }
  }, [daoAddress, networkId, gnosisAddress]);

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

  const getSafeService = useCallback(async () => {
    const web3 = await web3InstanceCustomRPC(networkId);

    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: localStorage.getItem("wallet"),
    });
    const safeService = new SafeApiKit({
      txServiceUrl: GNOSIS_TRANSACTION_URL,
      ethAdapter,
    });
    return safeService;
  }, [GNOSIS_TRANSACTION_URL]);

  const getExecutionTransaction = async () => {
    try {
      const safeService = await getSafeService();
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

  useEffect(() => {
    if (daoAddress) {
      fetchTokens();
      fetchNfts();
    }
  }, [daoAddress, fetchNfts, fetchTokens]);

  useEffect(() => {
    setLoaderOpen(true);
    if (gnosisAddress && GNOSIS_TRANSACTION_URL) {
      getExecutionTransaction();
      setLoaderOpen(false);
    }
    setLoaderOpen(false);
  }, [gnosisAddress, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    fetchProposalList();
  }, [daoAddress]);

  return (
    <>
      <Grid container spacing={3} paddingTop={2}>
        <Grid item md={8}>
          <Grid
            container
            mb={5}
            direction={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
            }}>
            <Grid item mb={4}>
              <Typography variant="heading">All Proposals</Typography>
            </Grid>
            <Grid
              item
              xs
              sx={{
                display: { lg: "flex" },
                justifyContent: { md: "flex-center", lg: "flex-end" },
              }}>
              <Grid container direction="row" spacing={2}>
                <Grid
                  item
                  xs
                  sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Select
                    sx={{ height: "60%", textTransform: "capitalize" }}
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
                      background: "#0F0F0F 0% 0% no-repeat padding-box",
                      width: "30%",
                    }}>
                    {proposalDisplayOptions.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.type}
                        sx={{ textTransform: "capitalize" }}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {isGovernanceActive || isAdminUser ? (
                  <Grid mt={"4px"} item>
                    <Button onClick={handleClickOpen}>Propose</Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
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
          <DocsCard />
        </Grid>
      </Grid>

      <CreateProposalDialog
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        tokenData={tokenData}
        nftData={nftData}
        daoAddress={daoAddress}
        fetchProposalList={fetchProposalList}
      />
      <BackdropLoader isOpen={open} />
    </>
  );
};

export default Proposal;

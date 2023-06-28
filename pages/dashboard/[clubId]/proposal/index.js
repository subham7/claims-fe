import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../../../src/components/layouts/layout1";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { proposalDisplayOptions } from "../../../../src/data/dashboard";
import DocsCard from "../../../../src/components/proposalComps/DocsCard";
import CreateProposalDialog from "../../../../src/components/proposalComps/CreateProposalDialog";
import { fetchProposals } from "../../../../src/utils/proposal";
import { useRouter } from "next/router";
import ProposalCard from "./ProposalCard";
import {
  getAssetsByDaoAddress,
  getNFTsByDaoAddress,
} from "../../../../src/api/assets";
import ClubFetch from "../../../../src/utils/clubFetch";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { setProposalList } from "../../../../src/redux/reducers/proposal";
import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import {
  getProposalByDaoAddress,
  getProposalTxHash,
} from "../../../../src/api/proposal";
import {
  showWrongNetworkModal,
  web3InstanceCustomRPC,
} from "../../../../src/utils/helper";
import { useConnectWallet } from "@web3-onboard/react";
import { addNftsOwnedByDao } from "../../../../src/redux/reducers/club";

const useStyles = makeStyles({
  noProposal_heading: {
    fontSize: "18px",
    fontWeight: "400",
    color: "white",
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
    padding: "10px 30px",
    marginTop: "50px",
  },
});

const Proposal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clubId: daoAddress } = router.query;
  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();
  const networkId = wallet?.chains[0].id;

  const [nftData, setNftData] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );

  const [open, setOpen] = useState(false);
  const [tokenData, setTokenData] = useState([]);

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const proposalList = useSelector((state) => {
    return state.proposal.proposalList;
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

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
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
    // router.push("/");
  };

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(daoAddress, NETWORK_HEX);
      setNftData(nftsData.data);
      dispatch(addNftsOwnedByDao(nftsData.data));
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, daoAddress]);

  const fetchTokens = useCallback(() => {
    if (daoAddress) {
      const tokenData = getAssetsByDaoAddress(
        isAssetsStoredOnGnosis ? gnosisAddress : daoAddress,
        NETWORK_HEX,
      );
      tokenData.then((result) => {
        if (result?.status != 200) {
          console.log("error in token daata fetching");
        } else {
          setTokenData(result.data.tokenPriceList);
        }
      });
    }
  }, [NETWORK_HEX, daoAddress, gnosisAddress, isAssetsStoredOnGnosis]);

  const fetchProposalList = async (type = "all") => {
    const data = await fetchProposals(daoAddress, type);
    dispatch(setProposalList(data));
  };

  const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedListItem(value);
    fetchProposalList(value);
  };

  const getSafeService = useCallback(async () => {
    const web3 = await web3InstanceCustomRPC();

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
  // getExecutionTransaction();

  useEffect(() => {
    if (daoAddress) {
      fetchTokens();
      fetchNfts();
    }
  }, [daoAddress, fetchTokens]);

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
    <Layout1 page={2}>
      <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
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
            <Grid item>
              <Typography variant="title">All Proposals</Typography>
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
                    sx={{ height: "80%", textTransform: "capitalize" }}
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
                      background: "#111D38 0% 0% no-repeat padding-box",
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

                {isGovernanceActive ? (
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        height: "80%",
                      }}
                      onClick={handleClickOpen}>
                      Propose
                    </Button>
                  </Grid>
                ) : isAdminUser ? (
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        height: "80%",
                      }}
                      onClick={handleClickOpen}>
                      Propose
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {proposalList?.length > 0 ? (
                <>
                  {executionTransaction && (
                    <>
                      <h2>Queued Transactions</h2>
                      <Grid
                        item
                        onClick={(e) => {
                          handleProposalClick(executionTransaction);
                        }}
                        md={12}>
                        <ProposalCard
                          proposal={executionTransaction}
                          // fetched={fetched}
                          executionTransaction={true}
                        />
                      </Grid>
                    </>
                  )}
                  {executionTransaction && <h2>Proposals</h2>}
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
                          // fetched={fetched}
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

      {showWrongNetworkModal(wallet, networkId)}

      <CreateProposalDialog
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        tokenData={tokenData}
        nftData={nftData}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loaderOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout1>
  );
};

export default ClubFetch(Proposal);

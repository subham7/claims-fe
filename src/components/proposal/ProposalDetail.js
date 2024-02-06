import React, { useCallback, useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  castVote,
  getProposalDetail,
  getProposalTxHash,
  patchProposalExecuted,
} from "api/proposal";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import tickerIcon from "../../../public/assets/icons/ticker_icon.svg";
import { calculateDays } from "utils/globalFunctions";
import actionIcon from "../../../public/assets/icons/action_icon.svg";
import surveyIcon from "../../../public/assets/icons/survey_icon.svg";
import ReactHtmlParser from "react-html-parser";

import Web3 from "web3";
import ProposalExecutionInfo from "@components/proposalComps/ProposalExecutionInfo";
import Signators from "@components/proposalComps/Signators";
import ProposalInfo from "@components/proposalComps/ProposalInfo";
import CurrentResults from "@components/proposalComps/CurrentResults";
import ProposalVotes from "@components/proposalComps/ProposalVotes";
import { getSafeSdk, handleSignMessage } from "utils/helper";
import { retrieveNftListing } from "api/assets";
import SafeAppsSDK from "@safe-global/safe-apps-sdk";
import { useAccount, useNetwork } from "wagmi";
import {
  createRejectSafeTx,
  executeRejectTx,
  fetchABI,
  getEncodedData,
  getTokenTypeByExecutionId,
  signRejectTx,
} from "utils/proposal";
import { BsInfoCircleFill } from "react-icons/bs";
import useAppContractMethods from "hooks/useAppContractMethods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import { ProposalDetailStyles } from "./ProposalDetailStyles";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import BackdropLoader from "@components/common/BackdropLoader";
import { setAlertData } from "redux/reducers/alert";
import { CHAIN_CONFIG } from "utils/constants";

const ProposalDetail = ({ pid, daoAddress }) => {
  const classes = ProposalDetailStyles();
  const router = useRouter();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const dispatch = useDispatch();

  const sdk = new SafeAppsSDK({
    allowedDomains: [/gnosis-safe.io$/, /safe.global$/, /5afe.dev$/],
    debug: true,
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

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const ERC721_Threshold = useSelector((state) => {
    return state.club.erc721ClubDetails.threshold;
  });

  const ERC20_Threshold = useSelector((state) => {
    return state.club.erc20ClubDetails.threshold;
  });

  const Club_Threshold =
    tokenType === "erc20" ? ERC20_Threshold : ERC721_Threshold;

  const [proposalData, setProposalData] = useState(null);
  const [governance, setGovernance] = useState(false);
  const [voted, setVoted] = useState(false);
  const [ownerAddresses, setOwnerAddresses] = useState([]);
  const [castVoteOption, setCastVoteOption] = useState("");
  const [cardSelected, setCardSelected] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [executionReady, setExecutionReady] = useState(false);
  const [signed, setSigned] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState("");
  const [txHash, setTxHash] = useState();
  const [cancelTxHash, setCancelTxHash] = useState();
  const [signedOwners, setSignedOwners] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [members, setMembers] = useState([]);
  const [isNftSold, setIsNftSold] = useState(false);
  const [isCancelSigned, setIsCancelSigned] = useState(false);
  const [isCancelExecutionReady, setIsCancelExecutionReady] = useState(false);
  const [isCancelExecuted, setIsCancelExecuted] = useState(false);
  const [isRejectTxnSigned, setIsRejectTxnSigned] = useState(false);

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const { getERC20TotalSupply, updateProposalAndExecution, getNftOwnersCount } =
    useAppContractMethods({ daoAddress });

  const { getBalance, getDecimals } = useCommonContractMethods();

  const isOwner = useCallback(async () => {
    if (gnosisAddress) {
      const { safeSdk, safeService } = await getSafeSdk(
        gnosisAddress,
        walletAddress,
        CHAIN_CONFIG[networkId].gnosisTxUrl,
        networkId,
      );

      const owners = await safeSdk.getOwners();

      const ownerAddressesArray = owners.map((value) =>
        Web3.utils.toChecksumAddress(value),
      );

      setOwnerAddresses(ownerAddressesArray);

      if (isGovernanceActive === false) {
        if (isAdmin) {
          setGovernance(true);
        } else setGovernance(false);
      } else setGovernance(true);
      const threshold = await safeSdk.getThreshold();

      const proposalData = await getProposalDetail(pid);

      if (proposalData.data[0].cancelProposalId) {
        const proposalTxHash = getProposalTxHash(
          proposalData.data[0].cancelProposalId,
        );
        proposalTxHash.then(async (result) => {
          if (
            result.status !== 200 ||
            (result.status === 200 && result.data.length === 0)
          ) {
            setCancelTxHash("");
          } else {
            setCancelTxHash(result.data[0].txHash);
            const tx = await safeService.getTransaction(result.data[0].txHash);
            const ownerAddresses = tx.confirmations.map(
              (confirmOwners) => confirmOwners.owner,
            );
            if (ownerAddresses.length) {
              setIsRejectTxnSigned(true);
            }
            const pendingTxs = await safeService.getPendingTransactions(
              Web3.utils.toChecksumAddress(gnosisAddress),
            );
            setPendingTxHash(
              pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
            );

            setSignedOwners(ownerAddresses);
            if (ownerAddresses.includes(walletAddress)) {
              setIsCancelSigned(true);
            }
            if (ownerAddresses.length >= threshold) {
              setIsCancelExecutionReady(true);
            }
          }
        });
      }
      const proposalTxHash = getProposalTxHash(pid);
      proposalTxHash.then(async (result) => {
        if (
          result.status !== 200 ||
          (result.status === 200 && result.data.length === 0)
        ) {
          setTxHash("");
        } else {
          setTxHash(result.data[0].txHash);
          const tx = await safeService.getTransaction(result.data[0].txHash);
          const ownerAddresses = tx.confirmations.map(
            (confirmOwners) => confirmOwners.owner,
          );
          const pendingTxs = await safeService.getPendingTransactions(
            Web3.utils.toChecksumAddress(gnosisAddress),
          );
          setPendingTxHash(
            pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
          );

          setSignedOwners(ownerAddresses);
          if (ownerAddresses.includes(walletAddress)) {
            setSigned(true);
          }
          if (ownerAddresses.length >= threshold) {
            setExecutionReady(true);
          }
        }
        setLoaderOpen(false);
      });
    }
  }, [gnosisAddress, isAdmin, isGovernanceActive, pid, walletAddress]);

  const shareOnLensterHandler = () => {
    const lensterUrl = `https://lenster.xyz/?text=${`
Lads, a new proposal has been added 🥳%0A%0A
Community vote is now LIVE in the ${clubData?.name} station.%0A%0A
Cast your vote before ${new Date(
      proposalData?.votingDuration,
    ).toLocaleDateString()} here: 
`}&url=${window.location.origin}/proposals/${daoAddress}/${pid}`;

    window.open(lensterUrl, "_blank");
  };

  const checkUserVoted = () => {
    if (walletAddress) {
      let obj = proposalData.vote.find(
        (voteCasted) => voteCasted.voterAddress === walletAddress,
      );
      const isVoted = proposalData.vote.indexOf(obj) >= 0;
      return isVoted;
    }
  };

  const submitVote = async () => {
    setLoaderOpen(true);
    const payload = {
      proposalId: pid,
      votingOptionId: castVoteOption,
      voterAddress: walletAddress,
      clubId: daoAddress,
      daoAddress: daoAddress,
    };
    const { signature } = await handleSignMessage(
      walletAddress,
      JSON.stringify(payload),
    );
    try {
      const result = await castVote({ ...payload, signature });

      if (result.status !== 201) {
        setVoted(false);
        setLoaderOpen(false);
      } else {
        await fetchData();
        setVoted(true);
        setLoaderOpen(false);
        dispatch(
          setAlertData({
            open: true,
            message: "Voted successfully",
            severity: "success",
          }),
        );
      }
    } catch (error) {
      setVoted(false);
      setLoaderOpen(false);

      const errorMessage =
        error.response && error.response.data
          ? error.response.data.msg
          : "Voting failed!";

      dispatch(
        setAlertData({
          open: true,
          message: errorMessage,
          severity: "error",
        }),
      );
    }
  };

  const fetchData = useCallback(async () => {
    const proposalData = getProposalDetail(pid);

    proposalData.then((result) => {
      if (result.status !== 200) {
        setFetched(false);
      } else {
        setProposalData(result.data[0]);
        setFetched(true);
      }
    });
  }, [pid]);

  const nftListingExists = async () => {
    const parts = proposalData?.commands[0]?.nftLink?.split("/");

    if (parts) {
      const linkData = parts.slice(-3);
      const nftdata = await retrieveNftListing(
        linkData[0],
        linkData[1],
        linkData[2],
      );
      if (
        !nftdata?.data?.orders.length &&
        proposalData?.commands[0]?.executionId === 8
      ) {
        setIsNftSold(true);
      } else {
        setIsNftSold(false);
      }
    }
  };

  useEffect(() => {
    if (proposalData && proposalData.commands[0]?.executionId === 8) {
      nftListingExists();
    }
  }, [proposalData]);

  const executeFunction = async (proposalStatus) => {
    setLoaderOpen(true);

    const ABI = await fetchABI(
      proposalData.commands[0].executionId,
      clubData.tokenType,
    );

    const {
      data,
      approvalData,
      transactionData,
      membersArray,
      airDropAmountArray,
    } = await getEncodedData({
      getERC20TotalSupply,
      getBalance,
      getDecimals,
      proposalData,
      daoAddress,
      clubData,
      factoryData,
      contractABI: ABI,
      setMembers,
      getNftOwnersCount,
      networkId,
      gnosisAddress,
    });

    const tokenData = getTokenTypeByExecutionId(proposalData.commands);

    const response = updateProposalAndExecution({
      data,
      approvalData,
      gnosisAddress: Web3.utils.toChecksumAddress(gnosisAddress),
      pid,
      tokenData,
      proposalStatus,
      proposalData,
      membersArray,
      airDropAmountArray,
      transactionData,
    });

    if (proposalStatus === "executed") {
      // fetchData()
      response.then(
        (result) => {
          result.promiEvent.on("confirmation", () => {
            const updateStatus = patchProposalExecuted(pid);
            updateStatus.then((result) => {
              if (result.status !== 200) {
                setExecuted(false);
                dispatch(
                  setAlertData({
                    open: true,
                    message: "Execution status update failed!",
                    severity: "error",
                  }),
                );
                setLoaderOpen(false);
              } else {
                fetchData();
                setExecuted(true);
                dispatch(
                  setAlertData({
                    open: true,
                    message: "Execution successful!",
                    severity: "success",
                  }),
                );
                setLoaderOpen(false);
              }
            });
          });
        },
        (error) => {
          console.error(error);
          setExecuted(false);
          dispatch(
            setAlertData({
              open: true,
              message: "Execution failed!",
              severity: "error",
            }),
          );
          setLoaderOpen(false);
        },
      );
    } else {
      await response
        .then(async (result) => {
          setSigned(true);
          isOwner();
        })
        .catch((err) => {
          console.error(err);
          setSigned(false);
          dispatch(
            setAlertData({
              open: true,
              message: "Signature failed!",
              severity: "error",
            }),
          );
          setLoaderOpen(false);
        });
    }
  };

  const createRejectSafeTransaction = async () => {
    setLoaderOpen(true);

    const response = await createRejectSafeTx({
      pid,
      gnosisTransactionUrl: CHAIN_CONFIG[networkId].gnosisTxUrl,
      gnosisAddress,
      network: networkId,
      daoAddress,
      walletAddress,
    });
    if (response) {
      fetchData();
      setIsCancelSigned(true);
      dispatch(
        setAlertData({
          open: true,
          message: "Signature successful!",
          severity: "success",
        }),
      );
      isOwner();
    } else {
      setIsCancelSigned(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Signature failed!",
          severity: "error",
        }),
      );
      setLoaderOpen(false);
    }
  };

  const signRejectTransaction = async () => {
    setLoaderOpen(true);

    const cancelPid = proposalData.cancelProposalId;
    const response = await signRejectTx({
      pid: cancelPid,
      walletAddress,
      gnosisTransactionUrl: CHAIN_CONFIG[networkId].gnosisTxUrl,
      gnosisAddress,
      networkId,
    });

    if (response) {
      fetchData();
      setIsCancelSigned(true);
      dispatch(
        setAlertData({
          open: true,
          message: "Signature successful!",
          severity: "success",
        }),
      );
      isOwner();
    } else {
      setIsCancelSigned(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Signature failed!",
          severity: "error",
        }),
      );
      setLoaderOpen(false);
    }
  };

  const executeRejectSafeTransaction = async () => {
    setLoaderOpen(true);
    const response = executeRejectTx({
      pid: proposalData?.cancelProposalId,
      gnosisTransactionUrl: CHAIN_CONFIG[networkId].gnosisTxUrl,
      gnosisAddress,
      walletAddress,
      networkId,
    });
    response.then(
      (result) => {
        result.promiEvent.on("confirmation", () => {
          const updateStatus = patchProposalExecuted(pid);
          updateStatus.then((result) => {
            if (result.status !== 200) {
              setExecuted(false);
              dispatch(
                setAlertData({
                  open: true,
                  message: "Execution status update failed!",
                  severity: "error",
                }),
              );
              setLoaderOpen(false);
            } else {
              fetchData();
              setExecuted(true);
              dispatch(
                setAlertData({
                  open: true,
                  message: "Execution successful!",
                  severity: "success",
                }),
              );
              setLoaderOpen(false);
            }
          });
        });
      },
      (error) => {
        console.error(error);
        setExecuted(false);
        dispatch(
          setAlertData({
            open: true,
            message: "Execution failed!",
            severity: "error",
          }),
        );

        setLoaderOpen(false);
      },
    );
  };

  useEffect(() => {
    if (pid) {
      setLoaderOpen(true);
      fetchData();
      isOwner();
    }
  }, [fetchData, isOwner, pid]);

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const data = await queryAllMembersFromSubgraph(daoAddress, networkId);
        if (data && data?.users) {
          setMembers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (daoAddress && networkId && walletAddress) {
      fetchAllMembers();
    }
  }, [daoAddress, networkId, walletAddress]);

  if (!walletAddress && proposalData === null) {
    return <>loading</>;
  }

  const statusClassMap = {
    active: classes.cardFontActive,
    passed: classes.cardFontPassed,
    executed: classes.cardFontExecuted,
    failed: classes.cardFontFailed,
  };

  return (
    <>
      <Grid container spacing={6} paddingTop={2} mb={8}>
        <Grid item md={8.5}>
          {/* back button */}
          <Grid container spacing={1} ml={-4} onClick={() => router.back()}>
            <Grid item mt={0.5} sx={{ "&:hover": { cursor: "pointer" } }}>
              <KeyboardBackspaceIcon className={classes.listFont} />
            </Grid>
            <Grid item sx={{ "&:hover": { cursor: "pointer" } }} mb={2}>
              <Typography className={classes.listFont}>
                Back to all proposals
              </Typography>
            </Grid>
          </Grid>
          {/* propsal name */}
          <Grid container mb={2}>
            <Grid item>
              <Typography className={classes.clubAssets}>
                {proposalData?.name}
              </Typography>
            </Grid>
          </Grid>
          {/* chips */}
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item ml={-1}>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid
                        container
                        sx={{ display: "flex", alignItems: "center" }}>
                        <Image src={tickerIcon} alt="ticker-icon" />
                        <Typography ml={1}>
                          {calculateDays(proposalData?.votingDuration) <= 0
                            ? "Voting closed"
                            : calculateDays(proposalData?.votingDuration) +
                              " days left"}
                        </Typography>
                      </Grid>
                    }
                  />
                </Grid>
                <Grid item>
                  <Chip
                    className={
                      proposalData?.type === "action"
                        ? classes.actionChip
                        : classes.surveyChip
                    }
                    label={
                      <Grid
                        container
                        sx={{ display: "flex", alignItems: "center" }}>
                        {proposalData?.type === "action" ? (
                          <Image src={actionIcon} alt="action-icon" />
                        ) : (
                          <Image src={surveyIcon} alt="survey-icon" />
                        )}
                        <Typography ml={1}>{proposalData?.type}</Typography>
                      </Grid>
                    }
                  />
                </Grid>
                <Grid item>
                  <Chip
                    className={statusClassMap[proposalData?.status]}
                    label={
                      proposalData?.status?.charAt(0).toUpperCase() +
                      proposalData?.status?.slice(1)
                    }
                  />
                </Grid>
                <Grid onClick={shareOnLensterHandler} item>
                  <Chip
                    className={classes.shareOnLens}
                    label={"Share on Lens"}
                    icon={
                      <Image
                        src="/assets/icons/lenster-comp.jpeg"
                        alt="Share on Lenster"
                        height={25}
                        width={25}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Proposal Info and Signators */}
          <Grid container spacing={2} mt={4} mb={3}>
            {proposalData && factoryData && proposalData.type !== "survey" && (
              <ProposalExecutionInfo
                proposalData={proposalData}
                fetched={fetched}
                daoDetails={factoryData}
              />
            )}

            {proposalData?.type === "action" && (
              <Signators
                ownerAddresses={ownerAddresses}
                signedOwners={signedOwners}
              />
            )}
          </Grid>

          {/* proposal description */}
          <Typography fontWeight={"500"}>Proposal description</Typography>
          <Grid container item className={classes.listFont}>
            <div
              className={classes.verticalScroll}
              dangerouslySetInnerHTML={{
                __html: ReactHtmlParser(proposalData?.description),
              }}></div>
          </Grid>
          <br />
          {isNftSold && (
            <div
              style={{
                background: "#D55438 0% 0% no-repeat padding-box",
                opacity: "50%",
                display: "flex",
                alignItems: "center",
                padding: "10px 30px",
                borderRadius: "10px",
              }}>
              <BsInfoCircleFill
                color="#dcdcdc"
                style={{ marginRight: "10px" }}
              />
              <p>
                This item has been sold already, please cancel this proposal
              </p>
            </div>
          )}
          {/* voting process before Signature */}
          {governance || proposalData?.type === "survey" ? (
            <>
              <Grid container mt={6}>
                <Grid item md={12}>
                  {proposalData?.type === "action" ? (
                    proposalData?.status === "active" ? (
                      <>
                        {checkUserVoted() ? (
                          <Card sx={{ width: "100%" }}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              mt={10}
                              mb={10}>
                              <Grid item mt={0.5}>
                                <CheckCircleRoundedIcon
                                  className={classes.mainCardButtonSuccess}
                                />
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography
                                  className={classes.successfulMessageText}>
                                  Successfully voted
                                </Typography>
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography className={classes.listFont2}>
                                  {/* Voted for */}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>
                        ) : (
                          <Card>
                            <Typography className={classes.cardFont1}>
                              Cast your vote
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                            <Stack spacing={2}>
                              {proposalData.votingOptions.map((data, key) => {
                                return (
                                  <CardActionArea
                                    className={classes.mainCard}
                                    key={key}
                                    disabled={voted}>
                                    <Card
                                      className={
                                        cardSelected == key
                                          ? classes.mainCardSelected
                                          : classes.mainCard
                                      }
                                      onClick={(e) => {
                                        setCastVoteOption(data.votingOptionId);
                                        setCardSelected(key);
                                      }}>
                                      <Grid
                                        container
                                        item
                                        justifyContent="center"
                                        alignItems="center">
                                        <Typography
                                          className={classes.cardFont1}>
                                          {data.text}{" "}
                                        </Typography>
                                      </Grid>
                                    </Card>
                                  </CardActionArea>
                                );
                              })}
                              <CardActionArea
                                className={classes.mainCard}
                                disabled={voted}>
                                <Card
                                  className={
                                    voted
                                      ? classes.mainCardButtonSuccess
                                      : classes.mainCardButton
                                  }
                                  onClick={!voted ? submitVote : null}>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center">
                                    {voted ? (
                                      <Grid item>
                                        <CheckCircleRoundedIcon />
                                      </Grid>
                                    ) : (
                                      <Grid item></Grid>
                                    )}
                                    <Grid item>
                                      {voted ? (
                                        <Typography
                                          className={classes.cardFont1}
                                          mt={0.5}>
                                          Successfully voted
                                        </Typography>
                                      ) : (
                                        <Typography
                                          className={classes.cardFont1}>
                                          Vote now
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Card>
                              </CardActionArea>
                            </Stack>
                          </Card>
                        )}
                      </>
                    ) : proposalData?.status === "passed" ? (
                      isAdmin ? (
                        <Card>
                          {proposalData?.cancelProposalId === undefined ? (
                            <Button
                              style={{
                                width: "100%",
                                padding: "1rem 0",
                              }}
                              className={
                                executed
                                  ? classes.mainCardButtonSuccess
                                  : classes.mainCardButton
                              }
                              onClick={
                                executionReady
                                  ? pendingTxHash === txHash
                                    ? () => {
                                        executeFunction("executed");
                                      }
                                    : () => {
                                        dispatch(
                                          setAlertData({
                                            open: true,
                                            message:
                                              "Execute txns with smaller nonce first",
                                            severity: "error",
                                          }),
                                        );
                                      }
                                  : () => {
                                      executeFunction("passed");
                                    }
                              }
                              disabled={
                                (!executionReady && signed) ||
                                executed ||
                                isNftSold
                              }>
                              <Grid
                                container
                                justifyContent="center"
                                alignItems="center">
                                {signed && !executionReady ? (
                                  <Grid item mt={0.5}>
                                    <CheckCircleRoundedIcon />
                                  </Grid>
                                ) : (
                                  <Grid item></Grid>
                                )}

                                {executed && signed ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Executed Successfully
                                    </Typography>
                                  </Grid>
                                ) : executionReady ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Execute Now
                                    </Typography>
                                  </Grid>
                                ) : !executionReady && !executed ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      {signed
                                        ? "Signed Succesfully"
                                        : "Sign Now"}
                                    </Typography>
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Button>
                          ) : null}
                          {(signed ||
                            isRejectTxnSigned ||
                            signedOwners.length) &&
                          proposalData.commands[0]?.executionId === 8 ? (
                            <Button
                              className={
                                executed
                                  ? classes.mainCardButtonSuccess
                                  : classes.mainCardButton
                              }
                              style={{
                                marginTop: "20px",
                                backgroundColor: "#D55438",
                                width: "100%",
                                padding: "1rem 0",
                              }}
                              disabled={
                                (!isCancelExecutionReady && isCancelSigned) ||
                                isCancelExecuted
                              }
                              onClick={
                                isCancelExecutionReady
                                  ? pendingTxHash === txHash
                                    ? () => {
                                        executeRejectSafeTransaction();
                                      }
                                    : () => {
                                        dispatch(
                                          setAlertData({
                                            open: true,
                                            message:
                                              "Execute txns with smaller nonce first",
                                            severity: "error",
                                          }),
                                        );
                                      }
                                  : !isRejectTxnSigned
                                  ? () => {
                                      createRejectSafeTransaction();
                                    }
                                  : () => {
                                      signRejectTransaction();
                                    }
                              }>
                              <Grid item>
                                {isCancelExecuted && isCancelSigned ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Executed Reject Successfully
                                    </Typography>
                                  </Grid>
                                ) : isCancelExecutionReady ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Execute Reject
                                    </Typography>
                                  </Grid>
                                ) : !isCancelExecutionReady &&
                                  !isCancelExecuted ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      {isCancelSigned
                                        ? "Cancellation Requested"
                                        : "Request Cancel"}
                                    </Typography>
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Button>
                          ) : null}
                        </Card>
                      ) : (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CheckCircleRoundedIcon
                                className={classes.mainCardButtonSuccess}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
                                Proposal needs to be executed by Admin
                              </Typography>
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography className={classes.listFont2}>
                                {/* Voted for */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      )
                    ) : (
                      <></>
                    )
                  ) : proposalData?.type === "survey" ? (
                    proposalData?.type === "survey" ? (
                      proposalData?.status === "active" ? (
                        checkUserVoted(pid) ? (
                          <Card sx={{ width: "100%" }}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              mt={10}
                              mb={10}>
                              <Grid item mt={0.5}>
                                <CheckCircleRoundedIcon
                                  className={classes.mainCardButtonSuccess}
                                />
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography
                                  className={classes.successfulMessageText}>
                                  Successfully voted
                                </Typography>
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography className={classes.listFont2}>
                                  {/* Voted for */}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>
                        ) : (
                          <Card>
                            <Typography className={classes.cardFont1}>
                              Cast your vote
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                            <Stack spacing={2}>
                              {fetched
                                ? proposalData?.votingOptions.map(
                                    (data, key) => {
                                      return (
                                        <CardActionArea
                                          className={classes.mainCard}
                                          key={key}
                                          disabled={voted}>
                                          <Card
                                            className={
                                              cardSelected == key
                                                ? classes.mainCardSelected
                                                : classes.mainCard
                                            }
                                            onClick={(e) => {
                                              setCastVoteOption(
                                                data.votingOptionId,
                                              );
                                              setCardSelected(key);
                                            }}>
                                            <Grid
                                              container
                                              item
                                              justifyContent="center"
                                              alignItems="center">
                                              <Typography
                                                className={classes.cardFont1}>
                                                {data.text}{" "}
                                              </Typography>
                                            </Grid>
                                          </Card>
                                        </CardActionArea>
                                      );
                                    },
                                  )
                                : null}
                              <CardActionArea
                                className={classes.mainCard}
                                disabled={voted}>
                                <Card
                                  className={
                                    voted
                                      ? classes.mainCardButtonSuccess
                                      : classes.mainCardButton
                                  }
                                  onClick={submitVote}>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center">
                                    {voted ? (
                                      <Grid item mt={0.5}>
                                        <CheckCircleRoundedIcon />
                                      </Grid>
                                    ) : (
                                      <Grid item></Grid>
                                    )}
                                    <Grid item>
                                      {voted ? (
                                        <Typography
                                          className={classes.cardFont1}>
                                          Successfully voted
                                        </Typography>
                                      ) : (
                                        <Typography
                                          className={classes.cardFont1}>
                                          Vote now
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Card>
                              </CardActionArea>
                            </Stack>
                          </Card>
                        )
                      ) : proposalData[0]?.status === "failed" ? (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CloseIcon
                                className={classes.mainCardButtonError}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
                                Voting Closed
                              </Typography>
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography className={classes.listFont2}>
                                {/* Voted for */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      ) : proposalData[0]?.status === "closed" ? (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CloseIcon
                                className={classes.mainCardButtonError}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
                                Voting Closed
                              </Typography>
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography className={classes.listFont2}>
                                {/* Voted for */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      ) : null
                    ) : null
                  ) : null}
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item md={3.5}>
          <Stack spacing={3}>
            <ProposalInfo
              proposalData={proposalData}
              fetched={fetched}
              threshold={Club_Threshold}
              members={members}
              isGovernanceActive={isGovernanceActive}
              ownerAddresses={ownerAddresses}
            />

            {(isGovernanceActive || proposalData?.type === "survey") && (
              <>
                <CurrentResults proposalData={proposalData} fetched={fetched} />
                <ProposalVotes proposalData={proposalData} fetched={fetched} />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      <BackdropLoader isOpen={loaderOpen} />
    </>
  );
};

export default ProposalDetail;

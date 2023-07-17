import React, { useCallback, useEffect, useState } from "react";
import Button from "@components/ui/button/Button";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";
import { useRouter } from "next/router";
import { useConnectWallet } from "@web3-onboard/react";
import {
  Alert,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { getUserProofAndBalance } from "../../src/api/claims";
// import MerkleTree from "merkletreejs";
// import keccak256 from "keccak256";
import Layout1 from "../../src/components/layouts/layout1";
import Countdown from "react-countdown";
import { useDispatch } from "react-redux";
import { addClaimEnabled } from "../../src/redux/reducers/createClaim";
import useSmartContractMethods from "../../src/hooks/useSmartContractMethods";
import useSmartContract from "../../src/hooks/useSmartContract";
// import WrongNetworkModal from "../../src/components/modals/WrongNetworkModal";
import Image from "next/image";
import { ClaimsStyles } from "../../src/components/claimsPageComps/ClaimsStyles";
import { subgraphQuery } from "../../src/utils/subgraphs";
import { CLAIMS_SUBGRAPH_URL_POLYGON } from "../../src/api";
import { QUERY_CLAIM_DETAILS } from "../../src/api/graphql/queries";

const ClaimAddress = () => {
  const classes = ClaimsStyles();
  // const dispatch = useDispatch();
  const router = useRouter();

  const [contractData, setContractData] = useState([]);
  const [totalAmountofTokens, setTotalAmountOfTokens] = useState(0);
  const [airdropTokenName, setAirdropTokenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [message, setMessage] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimableAmt, setClaimableAmt] = useState(0);
  const [decimalOfToken, setDecimalofToken] = useState(0);
  // const [merkleLeaves, setMerkleLeaves] = useState([]);
  const [claimActive, setClaimActive] = useState(false);
  const [claimInput, setClaimInput] = useState(0);
  const [showInputError, setShowInputError] = useState(false);
  const [claimRemaining, setClaimRemaining] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [claimBalanceRemaing, setClaimBalanceRemaing] = useState(0);
  const [daoTokenSymbol, setDaoTokenSymbol] = useState("");
  const [isClaimStarted, setIsClaimStarted] = useState(false);
  const [isEligibleForTokenGated, setIsEligibleForTokenGated] = useState(null);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [tokenGatingAmt, setTokenGatingAmt] = useState(0);
  const [claimsDataSubgraph, setClaimsDataSubgraph] = useState([]);

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;
  const networkId = wallet?.chains[0].id;

  const { claimAddress } = router.query;
  useSmartContract();

  const {
    claimSettings,
    claimBalance,
    claimAmount,
    claim,
    encode,
    getBalance,
    getTokenSymbol,
    getDecimals,
  } = useSmartContractMethods();

  const dispatch = useDispatch();

  // Times
  const currentTime = Date.now() / 1000;
  const endDateString = new Date(contractData?.endTime * 1000).toString();
  const startDateString = new Date(contractData?.startTime * 1000).toString();
  const startingTimeInNum = new Date(+contractData?.startTime * 1000);
  const endingTimeInNum = new Date(+contractData?.endTime * 1000);

  const fetchContractDetails = useCallback(async () => {
    setIsLoading(true);

    try {
      const desc = await claimSettings();
      setContractData(desc);
      setClaimEnabled(desc?.isEnabled);
      // setClaimEnabled(desc.isEnabled);
      dispatch(addClaimEnabled(desc?.isEnabled));

      if (desc?.airdropToken) {
        // decimals of airdrop token
        const decimals = await getDecimals(desc.airdropToken);
        setDecimalofToken(decimals);

        // remaining Balance in contract
        const remainingBalanceInContract = await claimBalance();

        const remainingBalanceInUSD = convertFromWeiGovernance(
          remainingBalanceInContract,
          decimals,
        );
        const claimableAmtInUSD = convertFromWeiGovernance(
          claimableAmt,
          decimals,
        );

        setClaimBalanceRemaing(remainingBalanceInUSD);

        const claimedAmt = await claimAmount(walletAddress);

        const isClaimed = claimedAmt > 0 ? true : false;
        setAlreadyClaimed(isClaimed);

        const remainingAmt = claimableAmt - claimedAmt;

        const remainingAmtInUSD = convertFromWeiGovernance(
          claimedAmt,
          decimals,
        );

        setClaimRemaining(remainingAmt);

        if (!isClaimed) {
          if (
            +remainingBalanceInUSD >= +claimableAmtInUSD &&
            (desc.permission == 0
              ? isEligibleForTokenGated
              : !isEligibleForTokenGated)
          ) {
            setClaimRemaining(claimableAmt);
          } else if (
            +remainingBalanceInUSD < +claimableAmtInUSD &&
            (desc.permission == 0
              ? isEligibleForTokenGated
              : !isEligibleForTokenGated)
          ) {
            setClaimRemaining(
              convertToWeiGovernance(remainingBalanceInUSD, decimals),
            );
          }
        } else {
          if (
            +remainingBalanceInUSD >= +remainingAmtInUSD &&
            (desc.permission == 0
              ? isEligibleForTokenGated
              : !isEligibleForTokenGated)
          ) {
            setClaimRemaining(remainingAmt);
          } else if (
            +remainingBalanceInUSD < +remainingAmtInUSD &&
            (desc.permission == 0
              ? isEligibleForTokenGated
              : !isEligibleForTokenGated)
          ) {
            setClaimRemaining(remainingBalanceInContract);
          }
        }

        // aridropToken Name
        const name = await getTokenSymbol(desc.airdropToken);
        setAirdropTokenName(name);

        // totalAmount of tokens
        const totalAmountInNumber = convertFromWeiGovernance(
          desc.claimAmountDetails[1],
          decimals,
        );

        setTotalAmountOfTokens(totalAmountInNumber);

        // if tokenGated
        if (desc.permission === "0" && contractData?.daoToken) {
          let daoTokenDecimal = 1;
          const daoTokenBalance = await getBalance(desc.daoToken);
          const tokenSymbol = await getTokenSymbol(desc.daoToken);
          try {
            daoTokenDecimal = await getDecimals(desc.daoToken);
          } catch (error) {
            console.log(error);
          }
          const tokenGatingValue = convertFromWeiGovernance(
            desc.tokenGatingValue,
            daoTokenDecimal,
          );

          setTokenGatingAmt(tokenGatingValue);
          setDaoTokenSymbol(tokenSymbol);

          if (+daoTokenBalance >= +desc.tokenGatingValue) {
            setIsEligibleForTokenGated(true);
          } else {
            setIsEligibleForTokenGated(false);
          }
        } else if (desc.permission === "1") {
          // getting claim amount from API
          const { amount } = await getUserProofAndBalance(
            contractData.merkleRoot,
            walletAddress,
          );

          setClaimableAmt(amount);

          // converting the CSV data into merkleLeaves
          // const csvData = await getCsvUserData(contractData.merkleRoot);

          // let encodedListOfLeaves = [];

          // csvData[0].snapshot.map((data) => {
          //   if (data.address) {
          //     const res = encode(data.address, data.amount);
          //     encodedListOfLeaves.push(keccak256(res));
          //   }
          // });

          // // setting merkleLeaves
          // setMerkleLeaves(encodedListOfLeaves);
        } else if (desc.permission === "3") {
          try {
            const amountOfTokenUserHas = await getBalance(desc?.daoToken);
            const tokenSymbol = await getTokenSymbol(desc.daoToken);
            setDaoTokenSymbol(tokenSymbol);
            setIsEligibleForTokenGated(
              +amountOfTokenUserHas > 0 ? true : false,
            );
          } catch (e) {
            console.log(e);
          }

          const userProofAndBalance = await getUserProofAndBalance(
            contractData?.merkleRoot,
            walletAddress,
          );

          setClaimableAmt(userProofAndBalance.amount);
        }
        // free for all (no merkleRoot)
        else {
          setClaimableAmt(desc.claimAmountDetails[0]);
        }

        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      // setIsLoading(true);
      setMessage(err.message);
      setIsLoading(false);
    }
  }, [
    claimAddress,
    claimableAmt,
    contractData?.daoToken,
    dispatch,
    isEligibleForTokenGated,
    networkId,
    walletAddress,
  ]);

  const claimHandler = async () => {
    setIsClaiming(true);
    try {
      if (
        contractData?.merkleRoot !==
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ) {
        const data = await getUserProofAndBalance(
          contractData?.merkleRoot,
          walletAddress,
        );

        const { amount, proof } = data;

        const encodedLeaf = encode(walletAddress, amount);

        await claim(
          convertToWeiGovernance(claimInput, decimalOfToken).toString(),
          walletAddress,
          proof,
          encodedLeaf,
        );

        const claimedAmt = await claimAmount(walletAddress);
        setClaimRemaining(claimableAmt - claimedAmt);
        setIsClaiming(false);
        setAlreadyClaimed(true);
        setClaimed(true);
        setClaimInput(0);
        showMessageHandler();
        setMessage("Successfully Claimed!");
      } else {
        await claim(
          convertToWeiGovernance(claimInput, decimalOfToken).toString(),
          walletAddress,
          [],
          0,
        );

        const claimedAmt = await claimAmount(walletAddress);

        const remainingAmt = claimableAmt - claimedAmt;

        const remainingAmtInUSD = convertFromWeiGovernance(
          remainingAmt,
          decimalOfToken,
        );

        if (+claimBalanceRemaing >= +remainingAmtInUSD) {
          setClaimRemaining(remainingAmt);
        } else {
          setClaimRemaining(claimBalanceRemaing);
        }

        setIsClaiming(false);
        setClaimed(true);
        setAlreadyClaimed(true);
        setClaimInput(0);

        showMessageHandler();
        setMessage("Successfully Claimed!");
      }
    } catch (err) {
      console.log(err);
      setClaimed(false);
      setMessage("Some Error Occured!");
      showMessageHandler();
      setMessage(err.message);
      setIsClaiming(false);
    }
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const maxHandler = async () => {
    const decimals = await getDecimals(contractData.airdropToken);
    if (+claimRemaining === 0 && !alreadyClaimed && claimBalanceRemaing) {
      setClaimInput(claimableAmt / 10 ** decimals);
    } else {
      setClaimInput(claimRemaining / 10 ** decimals);
    }
  };

  let whoCanClaim;
  if (claimsDataSubgraph[0]?.claimType === "1") {
    whoCanClaim = "Whitelisted";
  } else if (claimsDataSubgraph[0]?.claimType === "2") {
    whoCanClaim = "Everyone";
  } else if (claimsDataSubgraph[0]?.claimType === "0") {
    whoCanClaim = `Token Holders (${daoTokenSymbol})`;
  } else if (claimsDataSubgraph[0]?.claimType === "3") {
    whoCanClaim = `Token Holders ${daoTokenSymbol}`;
  }

  useEffect(() => {
    if (+contractData?.startTime > currentTime) {
      setClaimActive(false);
      setIsClaimStarted(false);
    } else if (+contractData?.endTime < currentTime) {
      setClaimActive(false);
      setIsClaimStarted(true);
    } else {
      setClaimActive(true);
      setIsClaimStarted(true);
    }
  }, [contractData?.endTime, contractData?.startTime, currentTime]);

  useEffect(() => {
    if (claimAddress) fetchContractDetails();
  }, [fetchContractDetails, claimAddress]);

  useEffect(() => {
    (async () => {
      try {
        // check if token is already claimed
        const claimedAmt = await claimAmount(walletAddress);
        const isClaimed = claimedAmt > 0 ? true : false;
        setAlreadyClaimed(isClaimed);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [claimAddress, walletAddress]);

  useEffect(() => {
    const fetchClaimsDataFromSubgraph = async () => {
      try {
        const { claims } = await subgraphQuery(
          CLAIMS_SUBGRAPH_URL_POLYGON,
          QUERY_CLAIM_DETAILS(claimAddress),
        );
        setClaimsDataSubgraph(claims);
      } catch (error) {
        console.log(error);
      }
    };

    if (claimAddress) fetchClaimsDataFromSubgraph();
  }, [claimAddress]);

  const isClaimButtonDisabled = () => {
    return (claimRemaining == 0 && alreadyClaimed && claimed) ||
      !claimActive ||
      !claimableAmt ||
      +claimInput <= 0 ||
      claimInput >= +claimRemaining ||
      (contractData?.permission == 0 && !isEligibleForTokenGated) ||
      (contractData?.permission === "3" && !isEligibleForTokenGated)
      ? true
      : false;
  };

  return (
    <Layout1 showSidebar={false}>
      <Image
        src="/assets/images/monogram.png"
        alt="StationX"
        height={50}
        width={50}
        style={{ cursor: "pointer", position: "fixed" }}
        onClick={() => {
          router.push("/");
        }}
      />
      {wallet ? (
        <>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {contractData ? (
                <div className={classes.container}>
                  {/* left */}
                  <div className={classes.lefContainer}>
                    <h2 className={classes.heading}>
                      {claimsDataSubgraph[0]?.description}
                    </h2>

                    <div className={classes.addressLine}>
                      <div className={classes.activeContainer}>
                        <div
                          className={`${
                            claimActive && claimEnabled
                              ? classes.active
                              : classes.inactive
                          }`}>
                          {claimActive && isClaimStarted && claimEnabled
                            ? "Active"
                            : (!claimActive && isClaimStarted) || !claimEnabled
                            ? "Inactive"
                            : !claimActive &&
                              !isClaimStarted &&
                              "Not started yet"}
                        </div>

                        <div className={classes.createdBy}>
                          <p style={{ margin: 0, padding: 0 }}>Created By</p>
                          <p
                            style={{ margin: 0, padding: 0 }}
                            className={classes.address}>
                            {contractData?.creatorAddress?.slice(0, 5)}...
                            {contractData?.creatorAddress?.slice(
                              contractData?.creatorAddress?.length - 5,
                            )}
                          </p>
                        </div>
                      </div>

                      {!isClaimStarted ? (
                        <>
                          <p className={classes.claimCloses}>
                            Claim starts in{" "}
                            {/* <span className={classes.time}>{endDateString}</span> */}
                          </p>
                          <Tooltip
                            title={startDateString}
                            placement="right-end">
                            <div
                              style={{
                                width: "fit-content",
                                cursor: "pointer",
                              }}>
                              <Countdown
                                className={classes.closingIn}
                                date={startingTimeInNum}
                              />
                            </div>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <p className={classes.claimCloses}>
                            Claim ends in
                            {/* <span className={classes.time}>{endDateString}</span> */}
                          </p>
                          <Tooltip title={endDateString} placement="right-end">
                            <div
                              style={{
                                width: "fit-content",
                                cursor: "pointer",
                              }}>
                              <Countdown
                                className={classes.closingIn}
                                date={endingTimeInNum}
                              />
                            </div>
                          </Tooltip>
                        </>
                      )}
                    </div>

                    <div className={classes.airdropContainer}>
                      <div className={classes.div}>
                        <p className={classes.para}>Airdrop</p>
                        <h3 className={classes.label}>{airdropTokenName}</h3>
                      </div>

                      <div className={classes.div}>
                        <p className={classes.para}>Size</p>
                        <h3 className={classes.label}>
                          {Number(totalAmountofTokens).toFixed(2)}
                        </h3>
                      </div>

                      <div className={classes.div}>
                        <p className={classes.para}>Who can claim?</p>
                        <h3 className={classes.label}>{whoCanClaim}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className={classes.rightContainer}>
                    <div className={classes.remainingClaim}>
                      <div>
                        <p className={classes.myClaim}>My Claim</p>
                        <div className={classes.claims}>
                          <p className={classes.claimAmt}>
                            {claimableAmt
                              ? Number(
                                  convertFromWeiGovernance(
                                    claimableAmt,
                                    decimalOfToken,
                                  ),
                                ).toFixed(2)
                              : 0}
                          </p>
                          <p className={classes.amount}>{airdropTokenName}</p>
                        </div>
                      </div>
                      <div>
                        <p className={classes.myClaim}>Remaining Amt</p>
                        <div className={classes.claims}>
                          <p className={classes.claimAmt}>
                            {claimRemaining
                              ? Number(
                                  convertFromWeiGovernance(
                                    claimRemaining,
                                    decimalOfToken,
                                  ),
                                ).toFixed(2)
                              : 0}
                            {/* {claimRemaining ? claimRemaining : 0} */}
                          </p>
                          <p className={classes.amount}>{airdropTokenName}</p>
                        </div>
                      </div>
                    </div>

                    <div className={classes.claimContainer}>
                      <input
                        onChange={(event) => {
                          setClaimInput(event.target.value);

                          if (
                            event.target.value >
                              Number(
                                convertFromWeiGovernance(
                                  claimRemaining,
                                  decimalOfToken,
                                ),
                              ) ||
                            claimInput >
                              Number(
                                convertFromWeiGovernance(
                                  claimRemaining,
                                  decimalOfToken,
                                ),
                              )
                          ) {
                            setShowInputError(true);
                          } else {
                            setShowInputError(false);
                          }
                        }}
                        // disabled={
                        //   !claimActive ||
                        //   !claimableAmt ||
                        //   !claimEnabled ||
                        //   (claimRemaining == 0 && alreadyClaimed)
                        //     ? true
                        //     : false
                        // }
                        value={claimInput}
                        placeholder="0"
                        type="number"
                        onWheel={(event) => event.target.blur()}
                        className={classes.input}
                      />
                      <button
                        // disabled={(!claimActive || !claimEnabled) && true}
                        style={
                          !claimActive
                            ? { cursor: "not-allowed" }
                            : { cursor: "pointer" }
                        }
                        onClick={maxHandler}
                        className={classes.max}>
                        Max
                      </button>
                    </div>

                    {showInputError && (
                      <p className={classes.error}>
                        Please enter number lesser than the remaining Amt
                      </p>
                    )}

                    <Button
                      onClick={claimHandler}
                      variant="normal"
                      disabled={isClaimButtonDisabled}
                      // style={
                      //   (alreadyClaimed && +claimRemaining === 0) ||
                      //   +claimInput <= 0 ||
                      //   (contractData?.permission === "0" &&
                      //     !isEligibleForTokenGated) ||
                      //   (contractData?.permission === "3" &&
                      //     !isEligibleForTokenGated) ||
                      //   +claimInput >= +claimRemaining ||
                      //   !claimActive ||
                      //   !claimableAmt
                      //     ? { cursor: "not-allowed" }
                      //     : { cursor: "pointer" }
                      // }
                    >
                      {isClaiming ? (
                        <CircularProgress size={25} />
                      ) : alreadyClaimed && +claimRemaining === 0 ? (
                        "Claimed"
                      ) : (
                        "Claim"
                      )}
                    </Button>
                    {!claimableAmt && (
                      <p className={classes.error}>
                        You are not eligible for the claim!
                      </p>
                    )}
                    {!isEligibleForTokenGated &&
                      contractData?.permission == 0 && (
                        <p className={classes.error}>
                          Only Token Holders of ${daoTokenSymbol} with more than{" "}
                          {Number(tokenGatingAmt).toFixed(0) + " "}
                          can claim!
                        </p>
                      )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          )}

          {claimed && showMessage ? (
            <Alert
              severity="success"
              sx={{
                width: "250px",
                position: "absolute",
                bottom: "30px",
                right: "20px",
                borderRadius: "8px",
              }}>
              {message}
            </Alert>
          ) : (
            !claimed &&
            showMessage && (
              <Alert
                severity="error"
                sx={{
                  width: "350px",
                  position: "absolute",
                  bottom: "30px",
                  right: "20px",
                  borderRadius: "8px",
                }}>
                {message}
              </Alert>
            )
          )}
          {/* {networkId && networkId !== "0x89" && <WrongNetworkModal />} */}
        </>
      ) : (
        <>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item mt={15}>
              <img
                className={classes.bannerImage}
                src="/assets/images/start_illustration.svg"
              />
            </Grid>

            <Grid item mt={4}>
              <Typography variant="regularText">
                Connect wallet to claim your airdrop
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Layout1>
  );
};

export default ClaimAddress;

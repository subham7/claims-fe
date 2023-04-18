import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SmartContract } from "../../src/api/contract";
import Navbar2 from "../../src/components/navbar2";
import claimContractABI from "../../src/abis/singleClaimContract.json";
import USDCContract from "../../src/abis/usdcTokenContract.json";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";

import { useRouter } from "next/router";
import { useConnectWallet } from "@web3-onboard/react";
import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  getClaimAmountForUser,
  getClaimsByUserAddress,
} from "../../src/api/claims";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import Navbar3 from "../../src/components/navbar";
import Image from "next/image";
import Layout1 from "../../src/components/layouts/layout1";
import Countdown from "react-countdown";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "90vh",
    color: "white",
    // width: "1300px",
    margin: "0 auto",
    // gap: "50px",
  },

  lefContainer: {
    width: "630px",
    padding: "10px",
    flex: 0.4,
  },

  heading: {
    fontSize: "40px",
    fontWeight: "400",
    margin: 0,
  },

  activeContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    padding: "10px 0",
  },

  active: {
    background: "#0ABB9240",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "#0ABB92",
  },

  inactive: {
    background: "#F75F71",
    padding: "10px 20px",
    borderRadius: "10px",
    // color: "",
  },

  airdropContainer: {
    display: "flex",
    gap: "50px",
  },

  createdBy: {
    background: "#142243",
    padding: "0px 10px",
    color: "#C1D3FF",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    margin: 0,
  },
  claimCloses: {
    color: "#C1D3FF",
    fontSize: "18px",
    fontWeight: "300",
    margin: "10px 0",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  para: {
    color: "#C1D3FF",
    fontSize: "16px",
    marginBottom: "8px",
    // padding: 0,
  },
  label: {
    margin: 0,
    padding: 0,
  },
  address: {
    color: "white",
  },

  rightContainer: {
    flex: 0.3,
    width: "600px",
    padding: "60px",
    borderRadius: "20px",
    color: "white",
    background: "#142243",
  },

  claimContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 20px",
    border: "0.5px solid #6475A3",
    borderRadius: "12px",
  },
  amount: {
    fontSize: "24px",
    fontWeight: "400",
    padding: 0,
    margin: 0,

    // margin:
  },

  btn: {
    width: "130px",
    fontFamily: "sans-serif",
    fontSize: "16px",
    border: "none",
    padding: "12px 24px",
    color: "white",
    background: "#3B7AFD",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
  claimAmt: {
    fontSize: "30px",
    margin: 0,
    padding: 0,
  },
  myClaim: {
    margin: 0,
    padding: 0,
    color: "#C1D3FF",
    fontSize: "14px",
  },
  claims: {
    display: "flex",
    marginTop: "10px",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    fontSize: "30px",
    outline: "none",
    background: "transparent",
    border: "none",
    color: "white",
  },
  max: {
    padding: "4px 12px",
    background: "#3B7AFD",
    borderRadius: "4px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  remainingClaim: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: {
    color: "#FF033E",
    fontSize: "14px",
  },
  nav: {
    padding: "10px 20px",
  },
  countdown: {
    width: "fit-content",
    background: "#FEB803",
    padding: "10px 10px",
    fontSize: "20px",
    borderRadius: "5px",
    margin: 0,
  },
  closingIn: {
    padding: "30px 0px",
    borderRadius: "10px",
    color: "#F8F5E4",
    fontSize: "24px",
    width: "fit-content",
  },

  div: {
    display: "flex",
    flexDirection: "column",
    gap: "-3px",
  },
});

const ClaimAddress = () => {
  const classes = useStyles();
  // const dispatch = useDispatch();
  const router = useRouter();

  const [contractData, setContractData] = useState([]);
  // const [erc20Decimal, setDecimals] = useState(null);
  const [airdropAmountInNum, setAirdropAmountInNum] = useState(0);
  const [totalAmountofTokens, setTotalAmountOfTokens] = useState(0);
  const [airdropTokenName, setAirdropTokenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [message, setMessage] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimableAmt, setClaimableAmt] = useState(0);
  const [decimalOfToken, setDecimalofToken] = useState(0);
  const [merkleLeaves, setMerkleLeaves] = useState([]);
  const [claimActive, setClaimActive] = useState(false);
  const [claimInput, setClaimInput] = useState(0);
  const [showInputError, setShowInputError] = useState(false);
  const [claimRemaining, setClaimRemaining] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [claimBalanceRemaing, setClaimBalanceRemaing] = useState(0);
  const [daoTokenSymbol, setDaoTokenSymbol] = useState("");
  const [isClaimStarted, setIsClaimStarted] = useState(false);

  const [isEligibleForTokenGated, setIsEligibleForTokenGated] = useState(null);

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;

  const { claimAddress } = router.query;

  // claims end date
  const endDateString = new Date(contractData.endTime * 1000).toString();
  const startDateString = new Date(contractData.startTime * 1000).toString();

  const currentTime = Date.now() / 1000;
  const startingTimeInNum = new Date(+contractData.startTime * 1000);
  const endingTimeInNum = new Date(+contractData.endTime * 1000);

  const fetchContractDetails = useCallback(async () => {
    setIsLoading(true);

    try {
      const claimContract = new SmartContract(
        claimContractABI,
        claimAddress,
        walletAddress,
        undefined,
        undefined,
      );

      const desc = await claimContract.claimSettings();
      console.log(desc);
      setContractData(desc);

      const erc20Contract = new SmartContract(
        USDCContract,
        desc.airdropToken,
        walletAddress,
        undefined,
        undefined,
      );

      // decimals of airdrop token
      const decimals = await erc20Contract.decimals();
      setDecimalofToken(decimals);

      // remaining Balance in contract
      const remainingBalanceInContract = await claimContract.claimBalance();

      const remainingBalanceInUSD = convertFromWeiGovernance(
        remainingBalanceInContract,
        decimals,
      );

      setClaimBalanceRemaing(remainingBalanceInUSD);

      // check if token is already claimed
      const hasClaimed = await claimContract.hasClaimed(walletAddress);
      setAlreadyClaimed(hasClaimed);

      const remainingAmt = await claimContract.claimAmount(walletAddress);

      const convertedRemainingAmt = convertFromWeiGovernance(
        remainingAmt,
        decimals,
      );

      if (
        !hasClaimed &&
        +remainingBalanceInUSD >= +claimableAmt &&
        (desc.permission == 0
          ? isEligibleForTokenGated
          : !isEligibleForTokenGated)
      ) {
        setClaimRemaining(convertToWeiGovernance(claimableAmt, decimals));
      } else if (
        !hasClaimed &&
        +remainingBalanceInUSD < +claimableAmt &&
        (desc.permission == 0
          ? isEligibleForTokenGated
          : !isEligibleForTokenGated)
      ) {
        setClaimRemaining(
          convertToWeiGovernance(remainingBalanceInUSD, decimals),
        );
      } else if (
        hasClaimed &&
        +remainingBalanceInUSD >= +convertedRemainingAmt &&
        (desc.permission == 0
          ? isEligibleForTokenGated
          : !isEligibleForTokenGated)
      ) {
        setClaimRemaining(remainingAmt);
      } else if (
        hasClaimed &&
        +remainingBalanceInUSD < +convertedRemainingAmt &&
        (desc.permission == 0
          ? isEligibleForTokenGated
          : !isEligibleForTokenGated)
      ) {
        setClaimRemaining(remainingBalanceInContract);
      }

      // aridropToken Name
      const name = await erc20Contract.obtainSymbol();
      setAirdropTokenName(name);

      if (desc.permission == 0) {
        const daoTokenContract = new SmartContract(
          USDCContract,
          desc.daoToken,
          walletAddress,
          undefined,
          undefined,
        );

        const daoTokenBalance = await daoTokenContract.balanceOf(walletAddress);
        const tokenSymbol = await daoTokenContract.obtainSymbol();
        setDaoTokenSymbol(tokenSymbol);

        if (+daoTokenBalance === 0) {
          setIsEligibleForTokenGated(false);
        } else {
          setIsEligibleForTokenGated(true);
        }
      }

      // totalAmount of tokens
      const totalAmountInNumber = convertFromWeiGovernance(
        desc.claimAmountDetails[2],
        decimals,
      );
      setTotalAmountOfTokens(totalAmountInNumber);

      // fetching description
      const dataFromAPI = await getClaimsByUserAddress(
        desc.creatorAddress.toLowerCase(),
      );
      const computedData = dataFromAPI.filter(
        (data) => data.claimContract === claimAddress,
      );
      setDescription(computedData[0].description);

      // if merkleRoot present (whitelisted)
      if (
        desc.merkleRoot !==
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ) {
        // getting claim amount from API
        const { amount } = await getClaimAmountForUser(
          walletAddress, // wallet address aayega
          claimAddress,
        );
        setClaimableAmt(amount);

        // converting the CSV data into merkleLeaves
        const csvData = await getClaimsByUserAddress(
          desc.creatorAddress.toLowerCase(),
        );

        const { addresses } = csvData
          .reverse()
          .find((address) => address.claimContract === claimAddress);

        console.log(addresses);

        let encodedListOfLeaves = [];

        addresses.map(async (data) => {
          const res = await claimContract.encode(
            data.address,
            convertToWeiGovernance(data.amount, decimals),
          );
          encodedListOfLeaves.push(keccak256(res));
        });

        // setting merkleLeaves
        setMerkleLeaves(encodedListOfLeaves);
      }

      // free for all (no merkleRoot)
      else {
        // claimable amount
        const airdropAmount = convertFromWeiGovernance(
          desc.claimAmountDetails[1],
          decimals,
        );
        console.log(desc);

        if (desc.daoToken !== "0x0000000000000000000000000000000000000000") {
          // amount for prorata
          const amount = await claimContract.checkAmount(walletAddress);
          const data = convertFromWeiGovernance(amount, decimals);

          setClaimableAmt(data);
        } else {
          setClaimableAmt(airdropAmount);
        }
      }

      setIsLoading(false);
    } catch (err) {
      // setIsLoading(true);
      setMessage(err.message);
      setIsLoading(false);
    }
  }, [claimAddress, claimableAmt, isEligibleForTokenGated, walletAddress]);

  const claimHandler = async () => {
    setIsClaiming(true);
    try {
      const claimContract = new SmartContract(
        claimContractABI,
        claimAddress,
        walletAddress,
        undefined,
        undefined,
      );

      if (
        contractData.merkleRoot !==
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ) {
        // const leaves = merkleLeaves.map((leaf) => keccak256(leaf));
        const tree = new MerkleTree(merkleLeaves, keccak256, { sort: true });

        const root = tree.getHexRoot();
        console.log("root", root);

        const encodedLeaf = await claimContract.encode(
          walletAddress,
          convertToWeiGovernance(claimableAmt, decimalOfToken),
        );

        const leaf = keccak256(encodedLeaf);
        console.log("ENcodded", encodedLeaf);

        const proof = tree.getHexProof(leaf);
        console.log("proof", proof);

        const amt = convertToWeiGovernance(claimInput, decimalOfToken);
        console.log("amt", amt);

        const res = await claimContract.claim(amt, proof, encodedLeaf);

        const remainingAmt = await claimContract.claimAmount(walletAddress);
        setClaimRemaining(remainingAmt);
        setIsClaiming(false);
        setAlreadyClaimed(true);
        setClaimed(true);
        setClaimInput(0);
        showMessageHandler();
        setMessage("Successfully Claimed!");
      } else {
        const res = await claimContract.claim(
          convertToWeiGovernance(claimInput, decimalOfToken).toString(),
          [],
          [],
        );

        const remainingAmt = await claimContract.claimAmount(walletAddress);

        const convertedRemainingAmt = convertFromWeiGovernance(
          remainingAmt,
          decimalOfToken,
        );

        if (+claimBalanceRemaing >= +convertedRemainingAmt) {
          setClaimRemaining(remainingAmt);
        } else {
          setClaimRemaining(
            convertToWeiGovernance(claimBalanceRemaing, decimalOfToken),
          );
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

  const maxHandler = () => {
    if (+claimRemaining === 0 && !alreadyClaimed && claimBalanceRemaing) {
      setClaimInput(claimableAmt);
    } else {
      setClaimInput(convertFromWeiGovernance(claimRemaining, decimalOfToken));
    }
  };

  let whoCanClaim;
  if (
    contractData.merkleRoot !==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  ) {
    whoCanClaim = "Whitelisted";
  } else if (contractData.permission === "3") {
    whoCanClaim = "Everyone";
  } else if (contractData.permission === "0") {
    whoCanClaim = `Token Holders (${daoTokenSymbol})`;
  }

  useEffect(() => {
    if (+contractData.startTime > currentTime) {
      setClaimActive(false);
      setIsClaimStarted(false);
    } else if (+contractData.endTime < currentTime) {
      setClaimActive(false);
      setIsClaimStarted(true);
    } else {
      setClaimActive(true);
      setIsClaimStarted(true);
    }
  }, [contractData.endTime, contractData.startTime, currentTime]);

  useEffect(() => {
    fetchContractDetails();
  }, [fetchContractDetails]);

  useEffect(() => {
    (async () => {
      try {
        const claimContract = new SmartContract(
          claimContractABI,
          claimAddress,
          walletAddress,
          undefined,
          undefined,
        );

        // check if token is already claimed
        const hasClaimed = await claimContract.hasClaimed(walletAddress);
        setAlreadyClaimed(hasClaimed);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [claimAddress, walletAddress]);

  return (
    <Layout1 showSidebar={false}>
      <>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.container}>
            {/* left */}
            <div className={classes.lefContainer}>
              <h2 className={classes.heading}>{description}</h2>

              <div className={classes.addressLine}>
                <div className={classes.activeContainer}>
                  <div
                    className={`${
                      claimActive ? classes.active : classes.inactive
                    }`}
                  >
                    {claimActive && isClaimStarted
                      ? "Active"
                      : !claimActive && isClaimStarted
                      ? "Inactive"
                      : !claimActive && !isClaimStarted && "Not started yet"}
                  </div>

                  <div className={classes.createdBy}>
                    <p>Created By</p>
                    <p className={classes.address}>
                      {contractData.creatorAddress?.slice(0, 5)}...
                      {contractData.creatorAddress?.slice(
                        contractData.creatorAddress?.length - 5,
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
                    <Tooltip title={startDateString} placement="right-end">
                      <div style={{ width: "fit-content", cursor: "pointer" }}>
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
                      Claim ends in{" "}
                      {/* <span className={classes.time}>{endDateString}</span> */}
                    </p>
                    <Tooltip title={endDateString} placement="right-end">
                      <div style={{ width: "fit-content", cursor: "pointer" }}>
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
                  <h3 className={classes.label}>{totalAmountofTokens}</h3>
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
                      {claimableAmt ? Number(claimableAmt).toFixed(2) : 0}
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
                  disabled={
                    !claimActive ||
                    !claimableAmt ||
                    (claimRemaining == 0 && alreadyClaimed)
                      ? true
                      : false
                  }
                  value={claimInput}
                  placeholder="0"
                  type="number"
                  className={classes.input}
                />
                <button
                  disabled={!claimActive && true}
                  style={
                    !claimActive
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  onClick={maxHandler}
                  className={classes.max}
                >
                  Max
                </button>
              </div>

              {showInputError && (
                <p className={classes.error}>
                  Please enter number lesser than the remaining Amt
                </p>
              )}

              <button
                onClick={claimHandler}
                className={classes.btn}
                disabled={
                  (claimRemaining == 0 && alreadyClaimed && claimed) ||
                  !claimActive ||
                  !claimableAmt ||
                  +claimInput <= 0 ||
                  claimInput >= +claimRemaining ||
                  (contractData.permission == 0 && !isEligibleForTokenGated)
                    ? true
                    : false
                }
                style={
                  (alreadyClaimed && +claimRemaining === 0) ||
                  +claimInput <= 0 ||
                  (contractData.permission == 0 && !isEligibleForTokenGated) ||
                  +claimInput >= +claimRemaining ||
                  !claimActive ||
                  !claimableAmt
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
              >
                {isClaiming ? (
                  <CircularProgress />
                ) : alreadyClaimed && +claimRemaining === 0 ? (
                  "Claimed"
                ) : (
                  "Claim"
                )}
              </button>
              {!claimableAmt && (
                <p className={classes.error}>
                  You are not eligible for the claim!
                </p>
              )}
              {!isEligibleForTokenGated && contractData.permission == 0 && (
                <p className={classes.error}>
                  Only Token Holders of ${daoTokenSymbol} can claim!
                </p>
              )}
            </div>
          </div>
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
            }}
          >
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
              }}
            >
              {message}
            </Alert>
          )
        )}
      </>
    </Layout1>
  );
};

export default ClaimAddress;

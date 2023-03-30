import { makeStyles } from "@mui/styles";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Alert, CircularProgress } from "@mui/material";
import {
  getClaimAmountForUser,
  getClaimsByUserAddress,
} from "../../src/api/claims";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";

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
    margin: 0,
    marginBottom: "10px",
  },
  para: {
    color: "#C1D3FF",
    fontSize: "16px",
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
    padding: "8px 20px",
    border: "0.5px solid #6475A3",
    borderRadius: "12px",
  },
  amount: {
    fontSize: "24px",
    fontWeight: "400",
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

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;

  const { claimAddress } = router.query;

  // claims end date
  const endDateString = new Date(contractData.endTime * 1000).toString();
  // const startTimeInEpoch = new Date(contractData.startTime).toString();
  const currentTime = Date.now() / 1000;
  console.log(contractData.startTime);

  useEffect(() => {
    if (
      +contractData.startTime > currentTime ||
      +contractData.endTime < currentTime
    ) {
      setClaimActive(false);
    } else {
      setClaimActive(true);
    }
  }, [contractData.endTime, contractData.startTime, currentTime]);

  const fetchContractDetails = async () => {
    // setIsLoading(true);

    try {
      const claimContract = new SmartContract(
        claimContractABI,
        claimAddress,
        walletAddress,
        undefined,
        undefined,
      );

      const desc = await claimContract.claimSettings();
      setContractData(desc);
      console.log(desc);

      // check if token is already claimed
      const hasClaimed = await claimContract.hasClaimed(walletAddress);
      setAlreadyClaimed(hasClaimed);

      const erc20Contract = new SmartContract(
        USDCContract,
        desc.airdropToken,
        walletAddress,
        undefined,
        undefined,
      );

      // aridropToken Name
      const name = await erc20Contract.name();
      setAirdropTokenName(name);

      // decimals of airdrop token
      const decimals = await erc20Contract.decimals();
      setDecimalofToken(decimals);

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
        console.log(walletAddress);

        // converting the CSV data into merkleLeaves
        const csvData = await getClaimsByUserAddress(walletAddress);
        console.log("hereeeeee", csvData);
        const { addresses } = csvData[csvData.length - 1];
        console.log(addresses);

        let encodedListOfLeaves = [];

        console.log(decimals);
        addresses.map(async (data) => {
          const res = await claimContract.encode(
            data.address,
            convertToWeiGovernance(data.amount, decimals),
          );
          encodedListOfLeaves.push(keccak256(res));
        });

        // setting merkleLeaves
        console.log("encodedLeaves", encodedListOfLeaves);
        setMerkleLeaves(encodedListOfLeaves);
        setIsLoading(false);
      }
      // free for all (no merkleRoot)
      else {
        // claimable amount
        const airdropAmount = convertFromWeiGovernance(
          desc.claimAmountDetails[1],
          decimals,
        );

        // const amount = await claimContract.checkAmount(walletAddress);
        // const data = convertFromWeiGovernance(amount, decimals);

        console.log(airdropAmount);
        setClaimableAmt(airdropAmount);
      }

      console.log(claimableAmt);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      // setMessage(err.message);
    }
  };

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
        console.log(merkleLeaves);
        // const leaves = merkleLeaves.map((leaf) => keccak256(leaf));

        const tree = new MerkleTree(merkleLeaves, keccak256, { sort: true });
        console.log(merkleLeaves);

        const root = tree.getHexRoot();
        console.log("current root", root);
        console.log("contract root", contractData.merkleRoot);

        const encodedLeaf = await claimContract.encode(
          walletAddress,
          convertToWeiGovernance(claimableAmt, decimalOfToken),
        );

        console.log(encodedLeaf);

        const leaf = keccak256(encodedLeaf);
        const proof = tree.getHexProof(leaf);
        console.log(encodedLeaf);

        const amt = convertToWeiGovernance(claimableAmt, decimalOfToken);
        console.log("proof", proof);
        console.log("amt", amt);
        console.log("leaf", leaf);

        const res = await claimContract.claim(amt, proof, encodedLeaf);

        // console.log(res);
      } else {
        const res = await claimContract.claim(
          convertToWeiGovernance(claimableAmt, decimalOfToken),
          [],
          [],
        );
        console.log(res);
      }
      setIsClaiming(false);
      setClaimed(true);
      setMessage("Successfully Claimed!");
      // console.log(desc);
    } catch (err) {
      console.log(err);
      setIsClaiming(false);
      setMessage("err.message");
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, [claimAddress, walletAddress]);

  return (
    <>
      <Navbar2 />

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
                <p
                  className={
                    claimActive ? `${classes.active}` : `${classes.inactive}`
                  }
                >
                  {claimActive ? "Active" : "Inactive"}
                </p>

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

              <p className={classes.claimCloses}>
                Claim closes on{" "}
                <span className={classes.time}>{endDateString}</span>
              </p>
            </div>

            <div className={classes.airdropContainer}>
              <div>
                <h3>{airdropTokenName}</h3>
                <p className={classes.para}>Airdrop</p>
              </div>

              <div>
                <h3>{totalAmountofTokens}</h3>
                <p className={classes.para}>Size</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className={classes.rightContainer}>
            <p className={classes.myClaim}>My Claim</p>

            <div className={classes.claimContainer}>
              <p className={classes.amount}>{claimableAmt}</p>
              <p className={classes.amount}>{airdropTokenName}</p>
            </div>

            {!claimed && !alreadyClaimed ? (
              <button
                disabled={
                  !walletAddress || !claimActive || claimableAmt === 0
                    ? true
                    : false
                }
                onClick={claimHandler}
                className={classes.btn}
                style={
                  !walletAddress
                    ? { cursor: "not-allowed" }
                    : { cursor: "pointer" }
                }
              >
                {isClaiming ? <CircularProgress /> : "Claim"}
              </button>
            ) : (
              <button
                disabled={true}
                style={{ cursor: "not-allowed" }}
                className={classes.btn}
              >
                Claimed!
              </button>
            )}
          </div>
        </div>
      )}

      {claimed && (
        <Alert
          // onClose={handleSnackBarClose}
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
      )}
    </>
  );
};

export default ClaimAddress;

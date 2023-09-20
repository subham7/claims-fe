import ProgressBar from "@components/progressbar";
import Button from "@components/ui/button/Button";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import React, { useEffect, useState } from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import {
  queryAllDropsTransactionsFromSubgraph,
  queryDropDetailsFromSubgraph,
} from "utils/dropsSubgraphHelper";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import { useAccount, useNetwork } from "wagmi";
import classes from "./NewClaim.module.scss";
import useDropsContractMethods from "hooks/useDropsContracMethods";
import { Alert, CircularProgress, Skeleton } from "@mui/material";
import useClaimSmartContracts from "hooks/useClaimSmartContracts";
import { getClaimDetails, getUserProofAndBalance } from "api/claims";
import ClaimActivity from "./ClaimActivity";
import Eligibility from "./Eligibility";
import Header from "./Header";
import ClaimInput from "./ClaimInput";
import Image from "next/image";
import About from "./About";

const NewClaim = ({ claimAddress }) => {
  const [claimsData, setClaimsData] = useState();
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenAddress: "",
    whitelistTokenSymbol: "",
    whitelistTokenDecimal: 1,
  });
  const [activityDetails, setActivityDetails] = useState({
    claimedAmt: "",
    address: "",
  });
  const [isClaimActive, setIsClaimActive] = useState(false);
  const [hasDropStarted, setHasDropStarted] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isEligibleForTokenGated, setIsEligibleForTokenGated] = useState(false);
  const [dropsData, setDropsData] = useState();
  const [claimedPercentage, setClaimedPercentage] = useState(0);
  const [maxClaimableAmount, setMaxClaimableAmount] = useState(0);
  const [claimRemaining, setClaimRemaining] = useState(0);
  const [remainingInUSD, setRemainingInUSD] = useState(0);
  const [claimInput, setClaimInput] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [bannerData, setBannerData] = useState();

  const currentTime = Date.now() / 1000;
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const { getDecimals, getTokenSymbol, approveDeposit, getBalance, encode } =
    useCommonContractMethods();

  const { claimSettings, claimBalance, claimAmount, claim } =
    useDropsContractMethods();

  useClaimSmartContracts(claimAddress);

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const { claims } = await queryDropDetailsFromSubgraph(
        claimAddress,
        networkId,
      );

      if (claims.length) setClaimsData(claims[0]);

      const tokenDecimal = await getDecimals(claims[0].airdropToken);
      const tokenSymbol = await getTokenSymbol(claims[0].airdropToken);

      let whitelistTokenSymbol;
      let whitelistTokenDecimal = 1;
      try {
        if (
          claims[0].whitelistToken !==
          "0x0000000000000000000000000000000000000000"
        )
          whitelistTokenSymbol = await getTokenSymbol(claims[0].whitelistToken);
        whitelistTokenDecimal = await getDecimals(claims[0].whitelistToken);
      } catch (error) {
        console.log(error);
      }

      setTokenDetails({
        tokenDecimal: tokenDecimal,
        tokenSymbol,
        tokenAddress: claims[0].airdropToken,
        whitelistTokenSymbol: whitelistTokenSymbol,
        whitelistTokenDecimal,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchTransactionActivity = async () => {
    try {
      const { airdrops } = await queryAllDropsTransactionsFromSubgraph(
        claimAddress,
        networkId,
      );
      setActivityDetails(airdrops.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContractData = async () => {
    try {
      const data = await claimSettings();
      setDropsData(data);

      // remaining in contract
      const remainingBalanceInContract = await claimBalance();

      const remainingBalanceInUSD = convertFromWeiGovernance(
        remainingBalanceInContract,
        tokenDetails.tokenDecimal,
      );
      setRemainingInUSD(remainingBalanceInUSD);

      const claimableAmtInUSD = convertFromWeiGovernance(
        maxClaimableAmount,
        tokenDetails.tokenDecimal,
      );

      const totalAmountClaimed =
        Number(
          convertFromWeiGovernance(
            data?.claimAmountDetails?.totalClaimAmount,
            tokenDetails?.tokenDecimal,
          ),
        ) -
        Number(
          convertFromWeiGovernance(
            remainingBalanceInContract,
            tokenDetails?.tokenDecimal,
          ),
        );

      const percentageClaimed =
        (totalAmountClaimed /
          Number(
            convertFromWeiGovernance(
              data?.claimAmountDetails?.totalClaimAmount,
              tokenDetails?.tokenDecimal,
            ),
          )) *
        100;
      setClaimedPercentage(percentageClaimed);

      // claimed by user
      const claimedAmt = (await claimAmount(walletAddress)) ?? 0;
      const isClaimed = +claimedAmt > 0;
      setAlreadyClaimed(isClaimed);

      const remainingAmt = +maxClaimableAmount - +claimedAmt;
      const remainingAmtInUSD = remainingAmt / 10 ** tokenDetails.tokenDecimal;

      setClaimRemaining(remainingAmt);

      if (!isClaimed) {
        if (
          +remainingBalanceInUSD >= +claimableAmtInUSD &&
          (dropsData?.permission == 0
            ? isEligibleForTokenGated
            : !isEligibleForTokenGated)
        ) {
          setClaimRemaining(maxClaimableAmount);
        } else if (
          +remainingBalanceInUSD < +claimableAmtInUSD &&
          (dropsData?.permission == 0
            ? isEligibleForTokenGated
            : !isEligibleForTokenGated)
        ) {
          setClaimRemaining(
            convertToWeiGovernance(
              remainingBalanceInUSD,
              tokenDetails.tokenDecimal,
            ),
          );
        }
      } else {
        if (
          +remainingBalanceInUSD >= +remainingAmtInUSD &&
          (dropsData?.permission == 0
            ? isEligibleForTokenGated
            : !isEligibleForTokenGated)
        ) {
          setClaimRemaining(remainingAmt);
        } else if (
          +remainingBalanceInUSD < +remainingAmtInUSD &&
          (dropsData?.permission == 0
            ? isEligibleForTokenGated
            : !isEligibleForTokenGated)
        ) {
          setClaimRemaining(remainingBalanceInContract);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkDropIsActive = () => {
    if (Number(dropsData?.startTime) > currentTime) {
      setIsClaimActive(false);
      setHasDropStarted(false);
    } else if (Number(dropsData?.endTime) < currentTime) {
      setIsClaimActive(false);
      setHasDropStarted(true);
    } else {
      setIsClaimActive(true);
      setHasDropStarted(true);
    }
  };

  const setClaimAmountByType = async (permission) => {
    try {
      switch (permission) {
        case "0": {
          const whitelistTokenBalance = await getBalance(dropsData?.daoToken);
          if (Number(whitelistTokenBalance) > dropsData?.tokenGatingValue) {
            setIsEligibleForTokenGated(true);
          } else {
            setIsEligibleForTokenGated(false);
          }
          setMaxClaimableAmount(+dropsData?.claimAmountDetails[0]);
          return;
        }

        case "1": {
          const { amount } = await getUserProofAndBalance(
            dropsData?.merkleRoot,
            walletAddress.toLowerCase(),
          );
          setMaxClaimableAmount(amount);
          return;
        }

        case "2": {
          setMaxClaimableAmount(+dropsData?.claimAmountDetails[0]);
          return;
        }

        case "3": {
          const whitelistTokenBalance = await getBalance(dropsData?.daoToken);
          setIsEligibleForTokenGated(whitelistTokenBalance > 0);

          const { amount } = await getUserProofAndBalance(
            dropsData?.merkleRoot,
            walletAddress.toLowerCase(),
          );

          setMaxClaimableAmount(+amount);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimHandler = async () => {
    setIsClaiming(true);
    try {
      if (
        dropsData?.merkleRoot !==
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ) {
        const data = await getUserProofAndBalance(
          dropsData?.merkleRoot,
          walletAddress.toLowerCase(),
        );

        const { amount, proof } = data;

        const encodedLeaf = encode(walletAddress, amount);

        await claim(
          claimAddress,
          convertToWeiGovernance(
            claimInput,
            tokenDetails.tokenDecimal,
          ).toString(),
          walletAddress,
          proof,
          encodedLeaf,
        );

        const claimedAmt = await claimAmount(walletAddress);
        setClaimRemaining(maxClaimableAmount - claimedAmt);
        setIsClaiming(false);
        setAlreadyClaimed(true);
        setClaimed(true);
        setClaimInput(0);
        showMessageHandler();
        setMessage("Successfully Claimed!");
      } else {
        await claim(
          claimAddress,
          convertToWeiGovernance(
            claimInput,
            tokenDetails.tokenDecimal,
          ).toString(),
          walletAddress,
          [],
          "",
        );

        const claimedAmt = await claimAmount(walletAddress);

        const remainingAmt = +maxClaimableAmount - +claimedAmt;

        const remainingAmtInUSD =
          remainingAmt / 10 ** tokenDetails.tokenDecimal;

        if (+remainingInUSD >= +remainingAmtInUSD) {
          setClaimRemaining(+remainingAmt);
        } else {
          setClaimRemaining(+remainingInUSD);
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
      // setMessage(err.message);
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
    if (
      +claimRemaining === 0 &&
      !alreadyClaimed &&
      convertFromWeiGovernance(remainingInUSD, tokenDetails.tokenDecimal)
    ) {
      setClaimInput(maxClaimableAmount / 10 ** tokenDetails.tokenDecimal);
    } else {
      setClaimInput(claimRemaining / 10 ** tokenDetails.tokenDecimal);
    }
  };

  const isClaimButtonDisabled = () => {
    return (claimRemaining == 0 && alreadyClaimed && claimed) ||
      !isClaimActive ||
      !maxClaimableAmount ||
      +claimInput <= 0 ||
      claimInput >
        +convertFromWeiGovernance(claimRemaining, tokenDetails.tokenDecimal) ||
      (dropsData?.permission == 0 && !isEligibleForTokenGated) ||
      (dropsData?.permission === "3" && !isEligibleForTokenGated)
      ? true
      : false;
  };

  const fetchBannerDetails = async () => {
    try {
      const data = await getClaimDetails(claimAddress);
      setBannerData(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkDropIsActive();
  }, [dropsData?.endTime, dropsData?.startTime, currentTime]);

  useEffect(() => {
    if (claimAddress && networkId) {
      fetchClaimDetails();
      fetchTransactionActivity();
    }
  }, [claimAddress, networkId, tokenDetails?.tokenDecimal]);

  useEffect(() => {
    if (tokenDetails.tokenAddress && claimAddress) fetchContractData();
  }, [tokenDetails, claimAddress]);

  useEffect(() => {
    if (dropsData?.permission) {
      setClaimAmountByType(dropsData.permission);
    }
  }, [dropsData?.permission, dropsData]);

  useEffect(() => {
    if (claimAddress) fetchBannerDetails();
  }, [claimAddress]);

  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <Header
            dropsData={dropsData}
            hasDropStarted={hasDropStarted}
            isClaimActive={isClaimActive}
            tokenDetails={tokenDetails}
          />

          <div className={classes.progress}>
            {+(claimedPercentage >= 0) ? (
              <p>{claimedPercentage.toFixed(3)}% claimed</p>
            ) : (
              <Skeleton width={300} />
            )}

            <ProgressBar value={claimedPercentage} />
          </div>

          <ClaimInput
            claimInput={claimInput}
            claimRemaining={claimRemaining}
            maxClaimableAmount={maxClaimableAmount}
            maxHandler={maxHandler}
            setClaimInput={setClaimInput}
            tokenDetails={tokenDetails}
          />

          <Button
            className={classes.claim}
            onClick={claimHandler}
            disabled={isClaimButtonDisabled()}
            variant="normal">
            {isClaiming ? (
              <CircularProgress size={25} />
            ) : alreadyClaimed && +claimRemaining === 0 ? (
              "Claimed"
            ) : (
              "Claim"
            )}
          </Button>
        </div>

        <div>
          <div className={classes.socials}>
            {bannerData?.socialLinks?.twitter && (
              <BsTwitter
                onClick={() => {
                  window.open(bannerData?.socialLinks?.twitter, "_blank");
                }}
              />
            )}

            {bannerData?.socialLinks?.discord && (
              <IoLogoDiscord
                onClick={() => {
                  window.open(bannerData?.socialLinks?.discord, "_blank");
                }}
              />
            )}

            {bannerData?.socialLinks?.telegram && (
              <BiLogoTelegram
                onClick={() => {
                  window.open(bannerData?.socialLinks?.telegram, "_blank");
                }}
              />
            )}
          </div>
        </div>
      </section>
      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          {bannerData?.imageLinks?.banner ? (
            <div className={classes.imageContainer}>
              <Image
                src={bannerData?.imageLinks?.banner}
                fill
                alt="Banner Image"
              />
            </div>
          ) : null}

          {claimsData ? (
            <h1>{claimsData?.description}</h1>
          ) : (
            <Skeleton height={60} />
          )}
        </div>

        {bannerData?.description && <About bio={bannerData?.description} />}

        <Eligibility claimsData={claimsData} tokenDetails={tokenDetails} />

        <ClaimActivity
          activityDetails={activityDetails}
          tokenDetails={tokenDetails}
        />
      </section>

      {claimed && showMessage ? (
        <Alert
          severity="success"
          sx={{
            width: "250px",
            position: "fixed",
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
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            {message}
          </Alert>
        )
      )}
    </main>
  );
};

export default NewClaim;

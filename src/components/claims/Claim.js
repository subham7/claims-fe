import PublicPageLayout from "@components/common/PublicPageLayout";
import TwitterSharingModal from "@components/modals/TwitterSharingModal";
import ProgressBar from "@components/progressbar";
import Button from "@components/ui/button/Button";
import {
  Skeleton,
  Typography,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { IDKitWidget } from "@worldcoin/idkit";
// import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useChainId } from "wagmi";

import { getClaimDetails, getUserProofAndBalance } from "api/claims";
import { getErc1155TokenId } from "api/token";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import { setAlertData } from "redux/reducers/alert";
import { ZERO_MERKLE_ROOT } from "utils/constants";
import {
  queryDropDetailsFromSubgraph,
  queryLatestTenDropsTransactionsFromSubgraph,
} from "utils/dropsSubgraphHelper";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import { convertToFullNumber, processAmount } from "utils/helper";
import { requestEthereumChain } from "utils/helper";
import classes from "./Claim.module.scss";
import ClaimInput from "./ClaimInput";
import { CHAIN_CONFIG } from "utils/constants";

const ClaimInputComponent = ({
  claimInputProps,
  buttonProps,
  claimedPercentage,
  isClaiming,
  alreadyClaimed,
  claimRemaining,
  account,
}) => {
  const switchNetworkHandler = async (event) => {
    const networkId = event.target.value;

    if (typeof window !== "undefined") {
      if (window?.ethereum?.networkVersion !== networkId) {
        try {
          await requestEthereumChain("wallet_switchEthereumChain", [
            { chainId: networkId },
          ]);
        } catch (err) {
          if (err.code === 4902 && CHAIN_CONFIG[networkId]) {
            const chainConfig = CHAIN_CONFIG[networkId];
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: networkId,
                  chainName: chainConfig.chainName,
                  rpcUrls: chainConfig.rpcUrls,
                  nativeCurrency: chainConfig?.nativeCurrency,
                  blockExplorerUrls: [chainConfig?.blockExplorerUrl],
                },
              ],
            });
          } else {
            console.log("some issue");
          }
        }
      }
    }
  };

  return (
    <>
      <ClaimInput {...claimInputProps} />

      <div>
        {/* <Typography className={classes.label}>
          Select network to claim from
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            variant="outlined"
            name="selectedToken"
            id="selectedToken"
            onChange={switchNetworkHandler}
            placeholder="Select network to claim from"
            select>
            <MenuItem value={"0x14a34"}>Base</MenuItem>
            <MenuItem value={"0x14a34"}>Linea</MenuItem>
          </TextField>
        </FormControl> */}

        <IDKitWidget
          app_id="app_3066124e44753d8dffd50878d8498345"
          action="claim"
          signal={account}
          onSuccess={buttonProps.onClick}
          autoClose>
          {({ open }) => (
            <button
              onClick={open}
              // className={classes.claim}
              // variant={buttonProps.variant}
              style={{
                background: "#fff",
                padding: "10px 15px",
                borderRadius: "6px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "15px",
              }}>
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
      </div>

      {/* <Button {...buttonProps}>
        {isClaiming ? (
          <CircularProgress size={25} />
        ) : alreadyClaimed && +claimRemaining === 0 ? (
          "Claimed"
        ) : (
          "Claim"
        )}
      </Button> */}

      <div className={classes.progress}>
        {+claimedPercentage >= 0 ? (
          <Typography variant="inherit">
            {claimedPercentage.toFixed(3)}% claimed
          </Typography>
        ) : (
          <Skeleton width={300} />
        )}

        <ProgressBar value={claimedPercentage} />
      </div>
    </>
  );
};

const Claim = ({ claimAddress, networkFromUrl }) => {
  const [claimsData, setClaimsData] = useState();
  const [loading, setLoading] = useState(false);
  const [erc1155TokenId, setErc1155TokenId] = useState(0);
  const [isTokenErc1155, setIsTokenErc1155] = useState();
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
  const dispatch = useDispatch();

  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenAddress: "",
    whitelistTokenSymbol: "",
    whitelistTokenDecimal: 0,
  });
  const [activityDetails, setActivityDetails] = useState({
    claimedAmt: "",
    address: "",
  });
  const [showTwitterShareModal, setShowTwitterShareModal] = useState(false);
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
  const [claimed, setClaimed] = useState(false);
  const [claimGeneralInfo, setClaimGeneralInfo] = useState();

  const currentTime = Date.now() / 1000;
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = networkFromUrl;
  console.log("networkFromUrl", networkId);

  const {
    getDecimals,
    getTokenSymbol,
    getBalance,
    encode,
    checkTokenIsErc1155,
    getBalanceErc1155,
    getTokenName,
  } = useCommonContractMethods();

  const { claimSettings, claimBalance, claimAmount, claim } =
    useDropsContractMethods();

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

      try {
        whitelistTokenSymbol = await getTokenName(claims[0].whitelistToken);
      } catch (error) {
        console.log(error);
      }

      let whitelistTokenDecimal = 0;

      try {
        whitelistTokenDecimal = await getDecimals(claims[0].whitelistToken);
      } catch (error) {
        console.log(error);
      }

      setTokenDetails({
        tokenDecimal: tokenDecimal,
        tokenSymbol,
        tokenAddress: claims[0].airdropToken,
        whitelistTokenSymbol: whitelistTokenSymbol,
        whitelistTokenDecimal: whitelistTokenDecimal,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchTransactionActivity = async () => {
    try {
      const { airdrops } = await queryLatestTenDropsTransactionsFromSubgraph(
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
      const data = await claimSettings(claimAddress);
      console.log("dropsata", data);
      setDropsData(data);

      // remaining in contract
      const remainingBalanceInContract = await claimBalance(claimAddress);

      const remainingBalanceInUSD = convertFromWeiGovernance(
        remainingBalanceInContract,
        tokenDetails.tokenDecimal,
      );
      setRemainingInUSD(remainingBalanceInUSD);

      const claimableAmtInUSD = convertFromWeiGovernance(
        maxClaimableAmount,
        tokenDetails.tokenDecimal,
      );

      const processedTotalClaimAmount = processAmount(
        data?.claimAmountDetails?.totalClaimAmount + "",
      );
      const processedRemainingBalanceInContract = processAmount(
        remainingBalanceInContract + "",
      );

      const totalAmountClaimed =
        Number(
          convertFromWeiGovernance(
            processedTotalClaimAmount,
            tokenDetails?.tokenDecimal,
          ),
        ) -
        Number(
          convertFromWeiGovernance(
            processedRemainingBalanceInContract,
            tokenDetails?.tokenDecimal,
          ),
        );

      const percentageClaimed =
        (totalAmountClaimed /
          Number(
            convertFromWeiGovernance(
              processedTotalClaimAmount,
              tokenDetails?.tokenDecimal,
            ),
          )) *
        100;

      setClaimedPercentage(percentageClaimed);

      // claimed by user
      const claimedAmt = (await claimAmount(claimAddress, walletAddress)) ?? 0;
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
          let whitelistTokenBalance;
          if (isTokenErc1155) {
            whitelistTokenBalance = await getBalanceErc1155(
              dropsData?.daoToken,
              erc1155TokenId,
            );
          } else {
            whitelistTokenBalance = await getBalance(dropsData?.daoToken);
          }

          setWhitelistTokenBalance(whitelistTokenBalance);

          if (
            Number(whitelistTokenBalance) >= Number(dropsData?.tokenGatingValue)
          ) {
            setIsEligibleForTokenGated(true);
          } else {
            setIsEligibleForTokenGated(false);
          }
          setMaxClaimableAmount(+dropsData?.claimAmountDetails.maxClaimable);
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
          setMaxClaimableAmount(+dropsData?.claimAmountDetails.maxClaimable);
          return;
        }

        case "3": {
          const { amount } = await getUserProofAndBalance(
            dropsData?.merkleRoot,
            walletAddress.toLowerCase(),
          );

          setIsEligibleForTokenGated(amount > 0);

          setMaxClaimableAmount(+amount);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimHandler = async (wiproof) => {
    console.log("claim handler", wiproof);

    setIsClaiming(true);
    try {
      console.log(dropsData);
      if (dropsData?.merkleRoot !== ZERO_MERKLE_ROOT) {
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
          erc1155TokenId,
          walletAddress,
          wiproof.merkle_root,
          wiproof.nullifier_hash,
          wiproof.proof,
        );

        const claimedAmt = await claimAmount(claimAddress, walletAddress);
        setClaimRemaining(maxClaimableAmount - claimedAmt);
        setIsClaiming(false);
        setAlreadyClaimed(true);
        setClaimed(true);
        setClaimInput(0);
        dispatch(
          setAlertData({
            open: true,
            message: "Successfully Claimed!",
            severity: "success",
          }),
        );
        setShowTwitterShareModal(true);
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
          erc1155TokenId,
          walletAddress,
          wiproof.merkle_root,
          wiproof.nullifier_hash,
          wiproof.proof,
        );

        fetchContractData();
        const claimedAmt = await claimAmount(claimAddress, walletAddress);

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

        dispatch(
          setAlertData({
            open: true,
            message: "Successfully Claimed!",
            severity: "success",
          }),
        );
        setShowTwitterShareModal(true);
      }
    } catch (err) {
      console.log(err);
      setClaimed(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Some error occured!",
          severity: "error",
        }),
      );
      setIsClaiming(false);
    }
  };

  const maxHandler = async () => {
    if (
      convertToFullNumber(claimRemaining + "") === 0 &&
      !alreadyClaimed &&
      convertFromWeiGovernance(remainingInUSD, tokenDetails.tokenDecimal)
    ) {
      setClaimInput(maxClaimableAmount / 10 ** tokenDetails.tokenDecimal);
    } else {
      setClaimInput(claimRemaining / 10 ** tokenDetails.tokenDecimal);
    }
  };

  const isClaimButtonDisabled = () => {
    return (convertToFullNumber(claimRemaining + "") == 0 &&
      alreadyClaimed &&
      claimed) ||
      !isClaimActive ||
      !maxClaimableAmount ||
      +claimInput <= 0 ||
      claimInput >
        +convertFromWeiGovernance(
          convertToFullNumber(claimRemaining + ""),
          tokenDetails.tokenDecimal,
        ) ||
      (dropsData?.permission == 0 && !isEligibleForTokenGated) ||
      (dropsData?.permission === "3" && !isEligibleForTokenGated)
      ? true
      : false;
  };

  const fetchBannerDetails = async () => {
    try {
      const data = await getClaimDetails(claimAddress);
      setClaimGeneralInfo(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkDropIsActive();
  }, [dropsData?.endTime, dropsData?.startTime, currentTime, networkId]);

  const fetchErc1155TokenId = async () => {
    const tokenId = await getErc1155TokenId(walletAddress, dropsData?.daoToken);

    const isTokenErc1155 = await checkTokenIsErc1155(dropsData?.daoToken);
    setIsTokenErc1155(isTokenErc1155);

    setErc1155TokenId(tokenId);
  };

  useEffect(() => {
    if (claimAddress && networkId) {
      fetchClaimDetails();
      fetchTransactionActivity();
    }
  }, [claimAddress, networkId, tokenDetails?.tokenDecimal]);

  useEffect(() => {
    if (tokenDetails.tokenAddress && claimAddress) fetchContractData();
  }, [tokenDetails, claimAddress, networkId]);

  useEffect(() => {
    if (dropsData?.daoToken && walletAddress) fetchErc1155TokenId();
  }, [dropsData?.daoToken, walletAddress]);

  useEffect(() => {
    if (dropsData?.permission) {
      setClaimAmountByType(dropsData.permission);
    }
  }, [
    dropsData?.permission,
    dropsData,
    networkId,
    erc1155TokenId,
    isTokenErc1155,
  ]);

  useEffect(() => {
    if (claimAddress) fetchBannerDetails();
  }, [claimAddress, networkId]);

  return (
    <>
      <PublicPageLayout
        clubData={dropsData}
        tokenDetails={tokenDetails}
        headerProps={{
          contractData: dropsData,
          deadline: dropsData?.endTime,
          tokenDetails: tokenDetails,
          isActive: isClaimActive,
          hasStarted: hasDropStarted,
          networkId: "",
        }}
        inputComponents={
          <ClaimInputComponent
            claimInputProps={{
              inputAmount: claimInput,
              claimRemaining: claimRemaining,
              maxClaimableAmount: maxClaimableAmount,
              maxHandler: maxHandler,
              setClaimInput: setClaimInput,
              tokenDetails: tokenDetails,
              claimsData: claimsData,
              whitelistTokenBalance,
            }}
            alreadyClaimed={alreadyClaimed}
            buttonProps={{
              className: classes.claim,
              onClick: claimHandler,
              disabled: isClaimButtonDisabled(),
              variant: "normal",
            }}
            claimRemaining={claimRemaining}
            claimedPercentage={claimedPercentage}
            isClaiming={isClaiming}
            account={walletAddress}
          />
        }
        socialData={claimGeneralInfo}
        imgUrl={claimGeneralInfo?.imageLinks?.banner}
        bio={claimGeneralInfo?.description}
        eligibilityProps={{
          contractData: claimsData,
          tokenDetails: tokenDetails,
        }}
        members={activityDetails}
        isSuccessfull={claimed}
        loading={false}
        claimDescription={claimsData?.description}
      />
      {showTwitterShareModal && claimAddress && claimsData && tokenDetails ? (
        <TwitterSharingModal
          message="Hurray! You've successfully claimed from this drop, let your friends know for good karma."
          tweetText={claimGeneralInfo?.tweetText}
          onClose={() => setShowTwitterShareModal(false)}
        />
      ) : null}
    </>
  );
};

export default Claim;

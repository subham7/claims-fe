import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { useSelector } from "react-redux";
import { fetchClubByDaoAddress, getClubInfo } from "api/club";
import { getWhitelistMerkleProof } from "api/whitelist";
import { useAccount, useChainId } from "wagmi";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import ERC20 from "@components/depositPageComps/ERC20/ERC20";
import BackdropLoader from "@components/common/BackdropLoader";
import ERC721 from "@components/depositPageComps/ERC721/ERC721";
import { CHAIN_CONFIG } from "utils/constants";
import BigNumber from "bignumber.js";
// import Modal from "@components/common/Modal/Modal";
// import classes from "../modals/StatusModal/StatusModal.module.scss";
// import { Typography } from "@mui/material";

const Join = ({ daoAddress, routeNetworkId }) => {
  const [daoDetails, setDaoDetails] = useState({
    depositDeadline: 0,
    minDeposit: 0,
    maxDeposit: 0,
    nftMinted: 0,
  });
  const [isEligibleForTokenGating, setIsEligibleForTokenGating] =
    useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remainingClaimAmount, setRemainingClaimAmount] = useState(0);
  const [whitelistUserData, setWhitelistUserData] = useState("");
  const [depositConfig, setDepositConfig] = useState({});
  const [isSignable, setIsSignable] = useState(false);
  const [allowanceValue, setAllowanceValue] = useState(0);
  const [isMetamaskPresent, setIsMetamaskPresent] = useState(true);
  const [gatedTokenDetails, setGatedTokenDetails] = useState(null);
  const [clubInfo, setClubInfo] = useState();

  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const TOKEN_TYPE = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const { getDecimals, getBalance, getTokenSymbol, checkCurrentAllowance } =
    useCommonContractMethods({ routeNetworkId });

  const { getTokenGatingDetails, getNftOwnersCount } = useAppContractMethods({
    daoAddress,
    routeNetworkId,
  });

  /**
   * Fetching details for ERC20 comp
   */
  const fetchErc20ContractDetails = async () => {
    try {
      setLoading(true);
      if (clubData?.depositCloseTime)
        setDaoDetails({
          depositDeadline: clubData?.depositCloseTime,
          minDeposit: clubData?.minDepositPerUser,
          maxDeposit: clubData?.maxDepositPerUser,
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  /**
   * Fetching details for ERC721 comp
   */
  const fetchErc721ContractDetails = async () => {
    try {
      setLoading(true);
      const nftMinted = await getNftOwnersCount();
      if (clubData?.depositCloseTime && Number(nftMinted?.actualValue) >= 0) {
        setDaoDetails({
          depositDeadline: clubData?.depositCloseTime,
          nftMinted: nftMinted.actualValue,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchTokenBalances = async (tokenGatingDetails) => {
    const promises = tokenGatingDetails.tokens.map(async (token, index) => {
      let decimal, symbol;

      const balance = await getBalance(token);
      const value = tokenGatingDetails.value[index];

      try {
        symbol = await getTokenSymbol(token);
      } catch (error) {
        console.log(error);
      }

      try {
        decimal = await getDecimals(token);
      } catch (error) {
        decimal = null;
      }

      const convertedBalance = decimal
        ? convertFromWeiGovernance(balance, decimal)
        : balance;
      const convertedValue = decimal
        ? convertFromWeiGovernance(value, decimal)
        : value;

      return {
        address: token,
        symbol,
        userBalance: convertedBalance.toString(),
        requiredAmount: convertedValue.toString(),
      };
    });
    return Promise.all(promises);
  };

  const evaluateEligibility = (tokensData, operator) => {
    if (operator === 0) {
      // AND condition: All tokens must meet the requirement
      return tokensData.every((token) =>
        BigNumber(token.userBalance).isGreaterThanOrEqualTo(
          BigNumber(token.requiredAmount),
        ),
      );
    } else if (operator === 1) {
      // OR condition: At least one token must meet the requirement
      return tokensData.some((token) =>
        BigNumber(token.userBalance).isGreaterThanOrEqualTo(
          BigNumber(token.requiredAmount),
        ),
      );
    }
    return false; // Default to false if operator is neither 0 nor 1
  };

  const fetchTokenGatingDetials = async () => {
    try {
      const tokenGatingDetails = await getTokenGatingDetails();

      if (tokenGatingDetails.tokens.length) {
        setIsTokenGated(true);
      }

      const tokensData = await fetchTokenBalances(tokenGatingDetails);
      setGatedTokenDetails({
        operator: tokenGatingDetails.operator,
        tokensData,
      });
      const eligibility = evaluateEligibility(
        tokensData,
        tokenGatingDetails.operator,
      );
      setIsEligibleForTokenGating(eligibility);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCurrentAllowance = async () => {
    try {
      const currentAllowance = await checkCurrentAllowance(
        clubData?.depositTokenAddress,
        CHAIN_CONFIG[networkId]?.factoryContractAddress,
      );

      setAllowanceValue(Number(currentAllowance));
    } catch (error) {
      console.error(error);
    }
  };

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubByDaoAddress(daoAddress?.toLowerCase());
    setDepositConfig(res?.data?.depositConfig);
    setIsSignable(
      res?.data?.depositConfig &&
        (res?.data?.depositConfig?.subscriptionDocId !== null ||
          res?.data?.depositConfig?.uploadDocId !== null)
        ? true
        : false,
    );
  };

  useEffect(() => {
    if (daoAddress) getDepositPreRequisites(daoAddress);
  }, [daoAddress, walletAddress, networkId]);

  useEffect(() => {
    if (daoAddress) {
      fetchTokenGatingDetials();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (daoAddress && clubData) {
      if (TOKEN_TYPE === "erc20") {
        fetchErc20ContractDetails();
      } else if (TOKEN_TYPE === "erc721") {
        fetchErc721ContractDetails();
      }
    }
  }, [TOKEN_TYPE, clubData, daoAddress]);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        if (daoAddress && daoDetails) {
          const data = await queryAllMembersFromSubgraph(
            daoAddress,
            routeNetworkId,
          );

          const userDepositAmount = data?.users?.find(
            (user) => user.userAddress === walletAddress,
          )?.depositAmount;
          if (userDepositAmount !== undefined && +userDepositAmount > 0) {
            setRemainingClaimAmount(
              Number(
                convertFromWeiGovernance(
                  +daoDetails.maxDeposit - +userDepositAmount,
                  6,
                ),
              ),
            );
          } else {
            setRemainingClaimAmount();
          }
          setMembers(data?.users);
        }
      };

      const clubInfo = async () => {
        const info = await getClubInfo(daoAddress);
        if (info.status === 200) setClubInfo(info.data[0]);
      };
      clubInfo();

      if (walletAddress) {
        fetchData();
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [daoAddress, daoDetails, networkId, walletAddress]);

  useEffect(() => {
    const fetchMerkleProof = async () => {
      try {
        const whitelistData = await getWhitelistMerkleProof(
          daoAddress,
          walletAddress.toLowerCase(),
        );

        setWhitelistUserData(whitelistData);
      } catch (error) {
        console.error(error);
      }
    };

    if (walletAddress) {
      fetchMerkleProof();
    }
  }, [daoAddress, walletAddress, networkId]);

  useEffect(() => {
    if (walletAddress && clubData?.depositTokenAddress) {
      fetchCurrentAllowance();
    }
  }, [
    CHAIN_CONFIG[networkId]?.factoryContractAddress,
    networkId,
    walletAddress,
    clubData?.depositTokenAddress,
  ]);

  useEffect(() => {
    if (!window?.ethereum) {
      setIsMetamaskPresent(false);
    } else {
      setIsMetamaskPresent(true);
    }
  }, [window?.ethereum]);

  return (
    <>
      {/* {routeNetworkId === "0x1" && (
        <div>
          <Modal className={classes.statusModal}>
            <div className={classes.image}>
              <Image
                src={"/assets/images/astronaut3.png"}
                height={220}
                width={220}
                alt="Create club"
              />
            </div>
            <Typography className={classes.heading} variant="inherit">
              GM, we&apos;re upgrading StationX
            </Typography>
            <Typography className={classes.subheading} variant="inherit">
              We&apos;ll be back soon!
            </Typography>
          </Modal>
        </div>
      )} */}
      <>
        {TOKEN_TYPE === "erc20" ? (
          <ERC20
            clubInfo={clubInfo}
            daoAddress={daoAddress}
            remainingClaimAmount={remainingClaimAmount}
            isTokenGated={isTokenGated}
            daoDetails={daoDetails}
            isEligibleForTokenGating={isEligibleForTokenGating}
            whitelistUserData={whitelistUserData}
            networkId={networkId}
            gatedTokenDetails={gatedTokenDetails}
            depositConfig={depositConfig}
            isSignable={isSignable}
            allowanceValue={allowanceValue}
            fetchCurrentAllowance={fetchCurrentAllowance}
            fetchErc20ContractDetails={fetchErc20ContractDetails}
            routeNetworkId={routeNetworkId}
            isMetamaskPresent={isMetamaskPresent}
          />
        ) : TOKEN_TYPE === "erc721" ? (
          <ERC721
            daoAddress={daoAddress}
            clubInfo={clubInfo}
            isTokenGated={isTokenGated}
            daoDetails={daoDetails}
            isEligibleForTokenGating={isEligibleForTokenGating}
            whitelistUserData={whitelistUserData}
            networkId={networkId}
            gatedTokenDetails={gatedTokenDetails}
            depositConfig={depositConfig}
            isSignable={isSignable}
            allowanceValue={allowanceValue}
            fetchCurrentAllowance={fetchCurrentAllowance}
            fetchErc721ContractDetails={fetchErc721ContractDetails}
            routeNetworkId={routeNetworkId}
            isMetamaskPresent={isMetamaskPresent}
          />
        ) : null}

        <BackdropLoader isOpen={loading} />
      </>
    </>
  );
};

export default Join;

import React, { useEffect, useState } from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { useSelector } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";
import { fetchClubByDaoAddress, getClubInfo } from "api/club";
// import ERC721 from "@components/depositPageComps/ERC721/ERC721";
import useAppContract from "hooks/useAppContract";
import { getWhitelistMerkleProof } from "api/whitelist";
import { useAccount, useNetwork } from "wagmi";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import NewErc721 from "@components/depositPageComps/ERC721/NewErc721";
import ERC20 from "@components/depositPageComps/ERC20/ERC20";

const Join = ({ daoAddress }) => {
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
  const [remainingClaimAmount, setRemainingClaimAmount] = useState();
  const [whitelistUserData, setWhitelistUserData] = useState();
  const [depositConfig, setDepositConfig] = useState({});

  const [gatedTokenDetails, setGatedTokenDetails] = useState({
    tokenASymbol: "",
    tokenBSymbol: "",
    tokenADecimal: 0,
    tokenBDecimal: 0,
    tokenAAmt: 0,
    tokenBAmt: 0,
    operator: 0,
    comparator: 0,
  });
  const [clubInfo, setClubInfo] = useState();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const TOKEN_TYPE = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  useAppContract(daoAddress);

  const { getDecimals, getBalance, getTokenSymbol } =
    useCommonContractMethods();

  const { getTokenGatingDetails, getNftOwnersCount } = useAppContractMethods();

  /**
   * Fetching details for ERC20 comp
   */
  const fetchErc20ContractDetails = async () => {
    try {
      setLoading(true);
      if (factoryData?.depositCloseTime)
        setDaoDetails({
          depositDeadline: factoryData?.depositCloseTime,
          minDeposit: factoryData?.minDepositPerUser,
          maxDeposit: factoryData?.maxDepositPerUser,
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

      if (factoryData?.depositCloseTime && nftMinted) {
        setDaoDetails({
          depositDeadline: factoryData?.depositCloseTime,
          nftMinted: nftMinted,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchTokenGatingDetials = async () => {
    try {
      setLoading(true);
      const tokenGatingDetails = await getTokenGatingDetails(daoAddress);

      if (tokenGatingDetails) {
        const tokenASymbol = await getTokenSymbol(
          tokenGatingDetails[0]?.tokenA,
        );
        const tokenBSymbol = await getTokenSymbol(
          tokenGatingDetails[0]?.tokenB,
        );

        let tokenADecimal, tokenBDecimal;

        try {
          tokenADecimal = await getDecimals(tokenGatingDetails[0]?.tokenA);
        } catch (error) {
          console.log(error);
        }

        try {
          tokenBDecimal = await getDecimals(tokenGatingDetails[0]?.tokenB);
        } catch (error) {
          console.log(error);
        }

        setGatedTokenDetails({
          tokenASymbol: tokenASymbol,
          tokenBSymbol: tokenBSymbol,
          tokenADecimal: tokenADecimal ? tokenADecimal : 0,
          tokenBDecimal: tokenBDecimal ? tokenBDecimal : 0,
          tokenAAmt: tokenGatingDetails[0]?.value[0],
          tokenBAmt: tokenGatingDetails[0]?.value[1],
          operator: tokenGatingDetails[0]?.operator,
          comparator: tokenGatingDetails[0]?.comparator,
        });

        if (tokenGatingDetails?.length) {
          setIsTokenGated(true);

          const balanceOfTokenAInUserWallet = await getBalance(
            tokenGatingDetails[0].tokenA,
          );
          const balanceOfTokenBInUserWallet = await getBalance(
            tokenGatingDetails[0].tokenB,
          );

          if (tokenGatingDetails[0].operator == 0) {
            if (
              +balanceOfTokenAInUserWallet >=
                +tokenGatingDetails[0]?.value[0] &&
              +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
            ) {
              setIsEligibleForTokenGating(true);
            } else {
              setIsEligibleForTokenGating(false);
            }
          } else if (tokenGatingDetails[0].operator == 1) {
            if (
              +balanceOfTokenAInUserWallet >=
                +tokenGatingDetails[0]?.value[0] ||
              +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
            ) {
              setIsEligibleForTokenGating(true);
            } else {
              setIsEligibleForTokenGating(false);
            }
          }
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubByDaoAddress(daoAddress?.toLowerCase());
    setDepositConfig(res?.data?.depositConfig);
  };

  useEffect(() => {
    if (daoAddress) getDepositPreRequisites(daoAddress);
  }, [daoAddress, walletAddress]);

  useEffect(() => {
    if (walletAddress && daoAddress && FACTORY_CONTRACT_ADDRESS) {
      fetchTokenGatingDetials();
    }
  }, [walletAddress, daoAddress, FACTORY_CONTRACT_ADDRESS]);

  useEffect(() => {
    if (daoAddress) {
      if (TOKEN_TYPE === "erc20") {
        fetchErc20ContractDetails();
      } else {
        fetchErc721ContractDetails();
      }
    }
  }, [TOKEN_TYPE, factoryData, FACTORY_CONTRACT_ADDRESS, daoAddress]);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        if (daoAddress && daoDetails) {
          const data = await queryAllMembersFromSubgraph(daoAddress, networkId);
          const userDepositAmount = data?.users.find(
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
      walletAddress && fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [
    SUBGRAPH_URL,
    daoAddress,
    daoDetails,
    walletAddress,
    FACTORY_CONTRACT_ADDRESS,
  ]);

  useEffect(() => {
    const fetchMerkleProof = async () => {
      try {
        const whitelistData = await getWhitelistMerkleProof(
          daoAddress,
          walletAddress.toLowerCase(),
        );

        setWhitelistUserData(whitelistData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMerkleProof();
  }, [daoAddress, walletAddress]);

  return (
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
        />
      ) : TOKEN_TYPE === "erc721" ? (
        <NewErc721
          daoAddress={daoAddress}
          clubInfo={clubInfo}
          isTokenGated={isTokenGated}
          daoDetails={daoDetails}
          isEligibleForTokenGating={isEligibleForTokenGating}
          whitelistUserData={whitelistUserData}
          networkId={networkId}
          gatedTokenDetails={gatedTokenDetails}
          depositConfig={depositConfig}
        />
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default Join;

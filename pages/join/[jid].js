import React, { useCallback, useEffect, useState } from "react";

import { useConnectWallet } from "@web3-onboard/react";
import NewArchERC20 from "../../src/components/depositPageComps/ERC20/NewArch/NewArchERC20";
import { useRouter } from "next/router";
import NewArchERC721 from "../../src/components/depositPageComps/ERC721/NewArch/NewArchERC721";
import {
  convertFromWeiGovernance,
  getImageURL,
} from "../../src/utils/globalFunctions";
import { subgraphQuery } from "../../src/utils/subgraphs";
import {
  QUERY_ALL_MEMBERS,
  QUERY_CLUB_DETAILS,
} from "../../src/api/graphql/queries";
import { useSelector } from "react-redux";
import ClubFetch from "../../src/utils/clubFetch";
import { Backdrop, CircularProgress, Grid, Typography } from "@mui/material";
import useSmartContractMethods from "../../src/hooks/useSmartContractMethods";
import Layout1 from "../../src/components/layouts/layout1";
import { showWrongNetworkModal } from "../../src/utils/helper";
import { getClubInfo } from "../../src/api/club";
// import useSmartContract from "../../src/hooks/useSmartContract";

const Join = () => {
  const [daoDetails, setDaoDetails] = useState({
    daoName: "",
    daoSymbol: "",
    decimals: 0,
    daoImage: "",
    clubTokensMinted: 0,
    quorum: 0,
    threshold: 0,
    isGovernance: false,
    isTokenGated: false,
    isTotalSupplyUnlinited: false,
    minDeposit: 0,
    maxDeposit: 0,
    totalSupply: 0,
    depositDeadline: 0,
    pricePerToken: 0,
    distributionAmt: 0,
    depositTokenAddress: "",
    createdBy: "",
    maxTokensPerUser: 0,
    nftURI: "",
    nftMinted: 0,
  });
  const [isEligibleForTokenGating, setIsEligibleForTokenGating] =
    useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remainingClaimAmount, setRemainingClaimAmount] = useState();
  const [fetchedDetails, setFetchedDetails] = useState({
    tokenA: "",
    tokenB: "",
    tokenAAmt: 0,
    tokenBAmt: 0,
    operator: 0,
    comparator: 0,
  });
  const [displayTokenDetails, setDisplayTokenDetails] = useState({
    tokenASymbol: "",
    tokenBSymbol: "",
    tokenADecimal: 0,
    tokenBDecimal: 0,
  });
  const [clubInfo, setClubInfo] = useState();
  const [{ wallet }] = useConnectWallet();
  const networkId = wallet?.chains[0].id;
  const router = useRouter();
  const { jid: daoAddress } = router.query;

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const TOKEN_TYPE = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const {
    getERC20TotalSupply,
    getERC20DAOdetails,
    getDecimals,
    getERC721DAOdetails,
    getNftOwnersCount,
    getBalance,
    getTokenGatingDetails,
    getTokenSymbol,
  } = useSmartContractMethods();

  /**
   * Fetching details for ERC20 comp
   */
  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      setLoading(true);

      const erc20Data = await getERC20DAOdetails();
      const erc20DaoDecimal = await getDecimals(daoAddress);
      const clubTokensMinted = await getERC20TotalSupply();

      if (erc20Data && factoryData)
        setDaoDetails({
          daoName: erc20Data.DaoName,
          daoSymbol: erc20Data.DaoSymbol,
          quorum: erc20Data.quorum,
          threshold: erc20Data.threshold,
          isGovernance: erc20Data.isGovernanceActive,
          decimals: erc20DaoDecimal,
          clubTokensMinted: clubTokensMinted,
          // daoImage: fetchedImage,
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,
          totalSupply:
            (factoryData.distributionAmount / 10 ** 18) *
            factoryData.pricePerToken,
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [daoAddress, factoryData]);

  /**
   * Fetching details for ERC721 comp
   */
  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      setLoading(true);

      const clubDetails = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_CLUB_DETAILS(daoAddress),
      );

      const imageUrl = await getImageURL(clubDetails?.stations[0].imageUrl);

      const erc721Data = await getERC721DAOdetails();
      const nftCount = await getNftOwnersCount();

      if (erc721Data && factoryData) {
        setDaoDetails({
          daoName: erc721Data.DaoName,
          daoSymbol: erc721Data.DaoSymbol,
          quorum: erc721Data.quorum,
          threshold: erc721Data.threshold,
          isGovernance: erc721Data.isGovernanceActive,
          maxTokensPerUser: erc721Data.maxTokensPerUser,
          isTotalSupplyUnlinited: erc721Data.isNftTotalSupplyUnlimited,
          createdBy: erc721Data.ownerAddress,
          daoImage: imageUrl,
          nftURI: clubDetails?.stations[0].imageUrl,
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,
          totalSupply:
            factoryData.distributionAmount * factoryData.pricePerToken,
          nftMinted: nftCount,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [SUBGRAPH_URL, daoAddress, factoryData]);

  const fetchTokenGatingDetials = useCallback(async () => {
    try {
      setLoading(true);

      const tokenGatingDetails = await getTokenGatingDetails(daoAddress);

      if (tokenGatingDetails) {
        setFetchedDetails({
          tokenA: tokenGatingDetails[0]?.tokenA,
          tokenB: tokenGatingDetails[0]?.tokenB,
          tokenAAmt: tokenGatingDetails[0]?.value[0],
          tokenBAmt: tokenGatingDetails[0]?.value[1],
          operator: tokenGatingDetails[0]?.operator,
          comparator: tokenGatingDetails[0]?.comparator,
        });

        const tokenASymbol = await getTokenSymbol(tokenGatingDetails[0].tokenA);
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

        setDisplayTokenDetails({
          tokenASymbol: tokenASymbol,
          tokenBSymbol: tokenBSymbol,
          tokenADecimal: tokenADecimal ? tokenADecimal : 0,
          tokenBDecimal: tokenBDecimal ? tokenBDecimal : 0,
        });

        if (tokenGatingDetails[0]?.length) {
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
  }, [daoAddress]);

  useEffect(() => {
    if (wallet) {
      fetchTokenGatingDetials();
    }
  }, [fetchTokenGatingDetials, wallet]);

  useEffect(() => {
    if (TOKEN_TYPE === "erc20") {
      fetchErc20ContractDetails();
    } else {
      fetchErc721ContractDetails();
    }
  }, [fetchErc20ContractDetails, TOKEN_TYPE, fetchErc721ContractDetails]);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        if (daoAddress && daoDetails) {
          const data = await subgraphQuery(
            SUBGRAPH_URL,
            QUERY_ALL_MEMBERS(daoAddress),
          );

          const userDepositAmount = data?.users.find(
            (user) => user.userAddress === wallet.accounts[0].address,
          )?.depositAmount;
          if (userDepositAmount !== undefined) {
            setRemainingClaimAmount(
              Number(
                convertFromWeiGovernance(
                  daoDetails.maxDeposit - userDepositAmount,
                  6,
                ),
              ),
            );
          } else setRemainingClaimAmount();
          setMembers(data?.users);
        }
      };

      const clubInfo = async () => {
        const info = await getClubInfo(daoAddress);
        if (info.status === 200) setClubInfo(info.data[0]);
      };
      clubInfo();
      wallet && fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [SUBGRAPH_URL, daoAddress, daoDetails, wallet]);

  return (
    <Layout1 showSidebar={false}>
      {TOKEN_TYPE === "erc20" ? (
        <NewArchERC20
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc20DaoAddress={daoAddress}
          daoDetails={daoDetails}
          members={members}
          remainingClaimAmount={remainingClaimAmount}
          fetchedTokenGatedDetails={fetchedDetails}
          displayTokenDetails={displayTokenDetails}
          clubInfo={clubInfo}
        />
      ) : TOKEN_TYPE === "erc721" ? (
        <NewArchERC721
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc721DaoAddress={daoAddress}
          daoDetails={daoDetails}
          clubInfo={clubInfo}
        />
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {showWrongNetworkModal(wallet, networkId)}

      {!wallet && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center">
          <Grid item mt={15}>
            <img
              style={{ width: "60vh" }}
              src="/assets/images/start_illustration.svg"
            />
          </Grid>
          <Grid item mt={4}>
            <Typography variant="mainHeading">Do more together</Typography>
          </Grid>
          <Grid item mt={4}>
            <Typography variant="regularText">
              Create or join a station in less than 60 seconds using StationX
            </Typography>
          </Grid>
        </Grid>
      )}
    </Layout1>
  );
};

export default ClubFetch(Join);
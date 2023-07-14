import React, { useCallback, useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { convertFromWeiGovernance } from "../../src/utils/globalFunctions";
import { subgraphQuery } from "../../src/utils/subgraphs";
import { QUERY_ALL_MEMBERS } from "../../src/api/graphql/queries";
import { useSelector } from "react-redux";
import ClubFetch from "../../src/utils/clubFetch";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import useSmartContractMethods from "../../src/hooks/useSmartContractMethods";
import Layout1 from "../../src/components/layouts/layout1";
import { showWrongNetworkModal } from "../../src/utils/helper";
import { getClubInfo } from "../../src/api/club";
import { makeStyles } from "@mui/styles";
import ERC721 from "../../src/components/depositPageComps/ERC721/NewArch/ERC721";
import ERC20 from "../../src/components/depositPageComps/ERC20/NewArch/ERC20";

const useStyles = makeStyles({
  image: {
    height: "40px",
    width: "auto !important",
    zIndex: "2000",
    cursor: "pointer",
  },
  navbarText: {
    flexGrow: 1,
    fontSize: "18px",
    color: "#C1D3FF",
  },
  navButton: {
    borderRadius: "10px",
    height: "auto",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    opacity: "1",
    fontSize: "18px",
  },
});

const Join = () => {
  const [daoDetails, setDaoDetails] = useState({
    depositDeadline: 0,
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
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const classes = useStyles();
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
    getDecimals,

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
      if (factoryData)
        setDaoDetails({
          depositDeadline: factoryData.depositCloseTime,
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [factoryData]);

  /**
   * Fetching details for ERC721 comp
   */
  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      setLoading(true);

      if (factoryData) {
        setDaoDetails({
          depositDeadline: factoryData.depositCloseTime,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [factoryData]);

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
        <ERC20
          clubInfo={clubInfo}
          daoAddress={daoAddress}
          remainingClaimAmount={remainingClaimAmount}
          isTokenGated={isTokenGated}
          daoDetails={daoDetails}
          isEligibleForTokenGating={isEligibleForTokenGating}
        />
      ) : TOKEN_TYPE === "erc721" ? (
        <ERC721
          daoAddress={daoAddress}
          clubInfo={clubInfo}
          isTokenGated={isTokenGated}
          daoDetails={daoDetails}
          isEligibleForTokenGating={isEligibleForTokenGating}
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
          sx={{
            height: "95vh",
          }}
          container
          direction="column"
          justifyContent="center"
          alignItems="center">
          <Grid item mt={4}>
            <Typography
              sx={{
                fontSize: "2.3em",
                fontFamily: "Whyte",
                color: "#F5F5F5",
              }}>
              Connect your wallet to StationX
            </Typography>
          </Grid>
          <Grid item mt={1}>
            <Typography variant="regularText">
              You’re all set! Connect wallet to join this Station 🛸
            </Typography>
          </Grid>

          <Grid item mt={3}>
            {connecting ? (
              <Button
                // sx={{ mt: 2, position: "fixed", right: 16 }}
                className={classes.navButton}>
                Connecting
              </Button>
            ) : wallet ? (
              <></>
            ) : (
              <Button
                // sx={{ mt: 2, position: "fixed", right: 16 }}
                className={classes.navButton}
                onClick={() => (wallet ? disconnect(wallet) : connect())}>
                Connect wallet
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Layout1>
  );
};

export default ClubFetch(Join);

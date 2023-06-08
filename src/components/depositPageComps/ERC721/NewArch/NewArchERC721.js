import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import { TwitterShareButton } from "react-twitter-embed";
import { NewArchERC721Styles } from "./NewArchERC721Styles";
import { useConnectWallet } from "@web3-onboard/react";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import WrongNetworkModal from "../../../modals/WrongNetworkModal";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
// import useSmartContract from "../../../../hooks/useSmartContract";
import useSmartContractMethods from "../../../../hooks/useSmartContractMethods";

const NewArchERC721 = ({
  daoDetails,
  erc721DaoAddress,
  isTokenGated,
  isEligibleForTokenGating,
}) => {
  console.log(daoDetails);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenName: "",
    tokenDecimal: 0,
    userBalance: 0,
  });
  const [count, setCount] = useState(1);
  const [balanceOfNft, setBalanceOfNft] = useState();

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();

  const walletAddress = wallet?.accounts[0].address;

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const classes = NewArchERC721Styles();

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  const dateSum = new Date(dayjs.unix(daoDetails.depositDeadline)).toString();

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const {
    approveDeposit,
    buyGovernanceTokenERC721DAO,
    getDecimals,
    getTokenSymbol,
    getTokenName,
    getBalance,
  } = useSmartContractMethods();

  const fetchTokenDetails = useCallback(async () => {
    try {
      const balanceOfNft = await getBalance(erc721DaoAddress);
      setBalanceOfNft(balanceOfNft);

      if (+balanceOfNft >= +daoDetails?.maxTokensPerUser) {
        setHasClaimed(true);
      } else {
        setHasClaimed(false);
      }
      const decimals = await getDecimals(daoDetails.depositTokenAddress);
      const symbol = await getTokenSymbol(daoDetails.depositTokenAddress);
      const name = await getTokenSymbol(daoDetails.depositTokenAddress);
      const userBalance = await getBalance(daoDetails.depositTokenAddress);

      setErc20TokenDetails({
        tokenSymbol: symbol,
        tokenName: name,
        tokenDecimal: decimals,
        userBalance: convertFromWeiGovernance(userBalance, decimals),
      });
    } catch (error) {
      console.log(error);
    }
  }, [daoDetails.depositTokenAddress, daoDetails?.maxTokensPerUser]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  const claimNFTHandler = async () => {
    try {
      setLoading(true);
      await approveDeposit(
        daoDetails.depositTokenAddress,
        FACTORY_CONTRACT_ADDRESS,
        convertFromWeiGovernance(
          daoDetails.pricePerToken,
          erc20TokenDetails.tokenDecimal,
        ),
        erc20TokenDetails.tokenDecimal,
      );

      await buyGovernanceTokenERC721DAO(
        walletAddress,
        erc721DaoAddress,
        daoDetails.nftURI,
        count,
        [],
      );
      setLoading(false);
      setClaimSuccessfull(true);
      router.push(`/dashboard/${erc721DaoAddress}`, undefined, {
        shallow: true,
      });
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setLoading(false);
      showMessageHandler();
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  return (
    <>
      <Grid className={classes.topGrid} container spacing={6}>
        {wallet ? (
          <>
            <Grid item md={5}>
              {daoDetails?.daoImage && (
                <img
                  src={daoDetails?.daoImage}
                  alt="nft image"
                  className={classes.nftImg}
                />
              )}
            </Grid>
            <Grid item md={6}>
              <Grid
                container
                spacing={1.5}
                sx={{ display: "flex", flexDirection: "column" }}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}></Grid>
                <Grid item sx={{ width: "100%" }}>
                  <Grid container>
                    <Grid item xs={12} md={9}>
                      <Typography variant="h2" className={classes.clubName}>
                        {daoDetails.daoName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs="auto">
                      {active ? (
                        <Typography className={classes.depositActive}>
                          <div className={classes.activeIllustration}></div>
                          Active
                        </Typography>
                      ) : (
                        <Typography className={classes.depositInactive}>
                          <div className={classes.executedIllustration}></div>
                          Finished
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs="auto">
                      <Typography className={classes.createdBy}>
                        Created by{" "}
                        {`${daoDetails.createdBy?.slice(
                          0,
                          5,
                        )}...${daoDetails.createdBy?.slice(-5)}`}
                      </Typography>
                    </Grid>

                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                      <div className="centerContent">
                        <div className="selfCenter spaceBetween">
                          <TwitterShareButton
                            onLoad={function noRefCheck() {}}
                            options={{
                              size: "large",
                              text: `Just joined ${daoDetails.daoName} Station on `,
                              via: "stationxnetwork",
                            }}
                            url={`${window.location.origin}/join/${erc721DaoAddress}`}
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item width="100%">
                  <Typography variant="subtitle1" color="#C1D3FF">
                    Mint closes on{" "}
                    {daoDetails.depositDeadline ? (
                      dateSum
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container spacing={3}>
                    {daoDetails.isGovernance && (
                      <>
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            className={classes.quoramTxt}>
                            {daoDetails.quorum / 100}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Quorum
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            className={classes.quoramTxt}>
                            {daoDetails.threshold / 100}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Threshold
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={4} width="fit-content">
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Nfts Remaining
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        className={classes.quoramTxt}>
                        {daoDetails.isTotalSupplyUnlinited
                          ? "Unlimited"
                          : Number(
                              convertFromWeiGovernance(
                                daoDetails.distributionAmt,
                                18,
                              ) *
                                convertFromWeiGovernance(
                                  daoDetails.pricePerToken,
                                  6,
                                ) -
                                Number(daoDetails.nftMinted),
                            ).toFixed(0)}
                        {/* : totalNftSupply - totalNftMinted} */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item width="100%">
                  <Typography variant="subtitle2" color="#C1D3FF">
                    Price
                  </Typography>
                  <Typography variant="h5" className={classes.quoramTxt}>
                    {/* {daoDetails.pricePerToken / Math.pow(10, 6)}  */}
                    {convertFromWeiGovernance(
                      daoDetails.pricePerToken,
                      erc20TokenDetails.tokenDecimal,
                    )}{" "}
                    {erc20TokenDetails.tokenSymbol}
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container className={classes.claimGrid}>
                    <Grid
                      spacing={3}
                      sx={{
                        color: "#EFEFEF",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "inherit",
                        alignItems: "center",
                      }}>
                      <IconButton
                        onClick={() => {
                          count > 1 ? setCount(count - 1) : 1;
                        }}>
                        <RemoveIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                      </IconButton>
                      <Typography
                        variant="h6"
                        color=""
                        sx={{ fontWeight: "bold" }}>
                        {count}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          count < daoDetails.maxTokensPerUser - balanceOfNft
                            ? setCount(count + 1)
                            : daoDetails.maxTokensPerUser
                        }
                        color="#000">
                        <AddIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                      </IconButton>
                    </Grid>

                    <Grid item>
                      <Button
                        onClick={claimNFTHandler}
                        disabled={
                          (remainingDays <= 0 && remainingTimeInSecs < 0) ||
                          hasClaimed ||
                          erc20TokenDetails.userBalance <
                            Number(
                              convertFromWeiGovernance(
                                daoDetails.pricePerToken,
                                erc20TokenDetails.tokenDecimal,
                              ),
                            )
                            ? true
                            : isTokenGated
                            ? !isEligibleForTokenGating
                            : false
                        }
                        sx={{ px: 8 }}>
                        {loading ? (
                          <CircularProgress />
                        ) : hasClaimed ? (
                          "Claimed"
                        ) : (
                          "Claim"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    className={classes.maxTokensTxt}>
                    This station allows maximum of {daoDetails.maxTokensPerUser}{" "}
                    mints per member
                  </Typography>
                  <Grid>
                    {isTokenGated && isEligibleForTokenGating ? (
                      <>
                        <Typography sx={{ color: "#3B7AFD" }}>
                          This club is token gated. You qualify
                        </Typography>
                      </>
                    ) : isTokenGated && !isEligibleForTokenGating ? (
                      <>
                        <Typography sx={{ color: "red" }}>
                          This club is token gated. You don&apos;t qualify
                        </Typography>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid className={classes.connectWalletTxtGrid}>
            <Typography variant="h5" className={classes.quoramTxt}>
              Please connect your wallet
            </Typography>
          </Grid>
        )}

        {WRONG_NETWORK && wallet && <WrongNetworkModal />}

        {claimSuccessfull && showMessage ? (
          <Alert
            severity="success"
            sx={{
              width: "250px",
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            Transaction Successfull
          </Alert>
        ) : (
          !claimSuccessfull &&
          showMessage && (
            <Alert
              severity="error"
              sx={{
                width: "250px",
                position: "fixed",
                bottom: "30px",
                right: "20px",
                borderRadius: "8px",
              }}>
              Transaction Failed
            </Alert>
          )
        )}
      </Grid>
    </>
  );
};

export default NewArchERC721;

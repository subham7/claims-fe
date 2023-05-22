import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useCallback, useEffect, useState } from "react";

import { TwitterShareButton } from "react-twitter-embed";
import Web3 from "web3";
import { NewArchERC721Styles } from "./NewArchERC721Styles";
import { useConnectWallet } from "@web3-onboard/react";
import erc20ABI from "../../../../abis/usdcTokenContract.json";
import erc721ABI from "../../../../abis/nft.json";

import factoryContractABI from "../../../../abis/newArch/factoryContract.json";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import { SmartContract } from "../../../../api/contract";
import dayjs from "dayjs";
import ClubFetch from "../../../../utils/clubFetch";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import WrongNetworkModal from "../../../modals/WrongNetworkModal";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const NewArchERC721 = ({
  daoDetails,
  erc721DaoAddress,
  isTokenGated,
  isEligibleForTokenGating,
}) => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenName: "",
    tokenDecimal: 0,
  });
  const [count, setCount] = useState(1);
  const [balanceOfNft, setBalanceOfNft] = useState();

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const CLUB_NETWORK_ID = useSelector((state) => {
    return state.gnosis.clubNetworkId;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
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

  const fetchTokenDetails = useCallback(async () => {
    try {
      const erc20Contract = new SmartContract(
        erc20ABI,
        daoDetails.depositTokenAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const erc721Contract = new SmartContract(
        erc721ABI,
        erc721DaoAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const balanceOfNft = await erc721Contract.balanceOf();
      setBalanceOfNft(balanceOfNft);

      if (+balanceOfNft >= +daoDetails?.maxTokensPerUser) {
        setHasClaimed(true);
      } else {
        setHasClaimed(false);
      }
      const decimals = await erc20Contract.decimals();
      const symbol = await erc20Contract.obtainSymbol();
      const name = await erc20Contract.name();

      setErc20TokenDetails({
        tokenSymbol: symbol,
        tokenName: name,
        tokenDecimal: decimals,
      });
    } catch (error) {
      console.log(error);
    }
  }, [
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    daoDetails.depositTokenAddress,
    daoDetails.maxTokensPerUser,
    erc721DaoAddress,
    walletAddress,
  ]);

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

      const factoryContract = new SmartContract(
        factoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
        true,
      );

      const erc20Contract = new SmartContract(
        erc20ABI,
        daoDetails.depositTokenAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
        true,
      );

      await erc20Contract.approveDeposit(
        FACTORY_CONTRACT_ADDRESS,
        convertFromWeiGovernance(
          daoDetails.pricePerToken,
          erc20TokenDetails.tokenDecimal,
        ),
        erc20TokenDetails.tokenDecimal,
      );

      const claimNFT = await factoryContract.buyGovernanceTokenERC721DAO(
        walletAddress,
        erc721DaoAddress,
        daoDetails.nftURI,
        count,
        [],
      );
      setLoading(false);
      setClaimSuccessfull(true);
      router.push(
        `/dashboard/${Web3.utils.toChecksumAddress(erc721DaoAddress)}`,
        undefined,
        {
          shallow: true,
        },
      );
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
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></Grid>
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
                            url={`https://test.stationx.network/join/${erc721DaoAddress}`}
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
                            className={classes.quoramTxt}
                          >
                            {daoDetails.quorum / 100}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Quorum
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            className={classes.quoramTxt}
                          >
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
                        className={classes.quoramTxt}
                      >
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
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          count > 1 ? setCount(count - 1) : 1;
                        }}
                      >
                        <RemoveIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                      </IconButton>
                      <Typography
                        variant="h6"
                        color=""
                        sx={{ fontWeight: "bold" }}
                      >
                        {count}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          count < daoDetails.maxTokensPerUser - balanceOfNft
                            ? setCount(count + 1)
                            : daoDetails.maxTokensPerUser
                        }
                        color="#000"
                      >
                        <AddIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                      </IconButton>
                    </Grid>

                    <Grid item>
                      <Button
                        onClick={claimNFTHandler}
                        disabled={
                          (remainingDays <= 0 && remainingTimeInSecs < 0) ||
                          hasClaimed
                            ? true
                            : isTokenGated
                            ? !isEligibleForTokenGating
                            : false
                        }
                        sx={{ px: 8 }}
                      >
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
                    className={classes.maxTokensTxt}
                  >
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

        {WRONG_NETWORK && <WrongNetworkModal chainId={CLUB_NETWORK_ID} />}

        {claimSuccessfull && showMessage ? (
          <Alert
            severity="success"
            sx={{
              width: "250px",
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}
          >
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
              }}
            >
              Transaction Failed
            </Alert>
          )
        )}
      </Grid>
    </>
  );
};

export default NewArchERC721;

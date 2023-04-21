import {
  Alert,
  Button,
  CircularProgress,
  Grid,
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
import factoryContractABI from "../../../../abis/newArch/factoryContract.json";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import { SmartContract } from "../../../../api/contract";
import { NEW_FACTORY_ADDRESS } from "../../../../api";

const NewArchERC721 = ({ daoDetails, erc721DaoAddress }) => {
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenName: "",
    tokenDecimal: 0,
  });

  const [{ wallet }] = useConnectWallet();

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const classes = NewArchERC721Styles();
  const isDepositActive = true;

  const day = Math.floor(new Date().getTime() / 1000.0);
  const remainingDays = daoDetails.depositDeadline - day;
  console.log(remainingDays);

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
        undefined,
        undefined,
      );

      console.log(erc20Contract);

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
  }, [daoDetails.depositTokenAddress, walletAddress]);

  const claimNFTHandler = async () => {
    try {
      setLoading(true);

      const factoryContract = new SmartContract(
        factoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        undefined,
        undefined,
      );

      const erc20Contract = new SmartContract(
        erc20ABI,
        daoDetails.depositTokenAddress,
        walletAddress,
        undefined,
        undefined,
      );

      await erc20Contract.approveDeposit(
        NEW_FACTORY_ADDRESS,
        convertFromWeiGovernance(
          daoDetails.pricePerToken,
          erc20TokenDetails.tokenDecimal,
        ),
        erc20TokenDetails.tokenDecimal,
      );

      const claimNFT = await factoryContract.buyGovernanceTokenERC721DAO(
        walletAddress,
        erc721DaoAddress,
        daoDetails.depositTokenAddress,
        "",
        1,
        [],
      );

      console.log(claimNFT);
      setLoading(false);
      setClaimSuccessfull(true);
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

                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
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
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs="auto">
                      {isDepositActive ? (
                        <Typography className={classes.depositActive}>
                          <div className={classes.activeIllustration}></div>
                          Active
                        </Typography>
                      ) : (
                        <Typography className={classes.depositActive}>
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
                    <Grid item xs="auto">
                      <MoreHorizIcon
                        sx={{
                          background: "#142243",
                          color: "#fff",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                        }}
                        fontSize="large"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item width="100%">
                  <Typography variant="subtitle1" color="#C1D3FF">
                    Mint closes on{" "}
                    {daoDetails.depositDeadline ? (
                      new Date(parseInt(daoDetails.depositDeadline) * 1000)
                        ?.toJSON()
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")
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
                      <Typography
                        variant="subtitle1"
                        className={classes.quoramTxt}
                      >
                        {daoDetails.isTotalSupplyUnlinited ? "unlimited" : ""}
                        {/* : totalNftSupply - totalNftMinted} */}
                      </Typography>
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Nfts Remaining
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
                    {/* <Grid
                          spacing={3}
                          sx={{
                            background: "#EFEFEF",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "inherit",
                            alignItems: "center",
                          }}
                        >
                          
                          <IconButton onClick={() => setCount(count - 1)}>
                            <RemoveIcon sx={{ color: "black", fontSize: 20 }} />
                          </IconButton>
                          <Typography
                            variant="h6"
                            color=""
                            sx={{ fontWeight: "bold" }}
                          >
                            {count}
                          </Typography>
                          <IconButton
                            onClick={() => setCount(count + 1)}
                            color="#000"
                          >
                            <AddIcon sx={{ color: "black", fontSize: 20 }} />
                          </IconButton>
                        </Grid> */}
                    <Grid item>
                      <Button
                        onClick={claimNFTHandler}
                        disabled={
                          loading
                          // ||
                          // (tokenGatingAddress !==
                          //   "0x0000000000000000000000000000000000000000" &&
                          //   userTokenBalance < tokenGatingAmount)
                        }
                        sx={{ px: 8 }}
                      >
                        {loading ? <CircularProgress /> : "Claim"}
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
                  {/* {tokenGatingAddress !==
                    "0x0000000000000000000000000000000000000000" && (
                    <>
                      {userTokenBalance < tokenGatingAmount ? (
                        <Typography variant="subtitle2" sx={{ color: "red" }}>
                          This club is Token Gated. You don&apos;t qualify
                        </Typography>
                      ) : (
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#3B7AFD" }}
                        >
                          This club is Token Gated. You qualify
                        </Typography>
                      )}
                    </>
                  )} */}
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

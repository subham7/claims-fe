import {
  Alert,
  Button,
  CircularProgress,
  // CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { TbWorld } from "react-icons/tb";
import { BiLogoTelegram } from "react-icons/bi";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { subgraphQuery } from "../../../../utils/subgraphs";
import { QUERY_CLUB_DETAILS } from "../../../../api/graphql/queries";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  getImageURL,
} from "../../../../utils/globalFunctions";
import useSmartContractMethods from "../../../../hooks/useSmartContractMethods";
import { useConnectWallet } from "@web3-onboard/react";
import ReactHtmlParser from "react-html-parser";
import dayjs from "dayjs";
import { showWrongNetworkModal } from "../../../../utils/helper";

const ERC721 = ({ daoAddress, daoDetails, clubInfo }) => {
  const [clubData, setClubData] = useState([]);
  const [count, setCount] = useState(1);
  const [balanceOfNft, setBalanceOfNft] = useState();
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenName: "",
    tokenDecimal: 0,
    userBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const {
    approveDeposit,
    buyGovernanceTokenERC721DAO,
    getDecimals,
    getTokenSymbol,
    getTokenName,
    getBalance,
  } = useSmartContractMethods();

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;
  const networkId = wallet?.chains[0].id;

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const Deposit_Token_Address = useSelector((state) => {
    return state.club.factoryData.depositTokenAddress;
  });

  const fetchTokenDetails = useCallback(async () => {
    try {
      const balance = await getBalance(daoAddress);
      setBalanceOfNft(balance);

      if (+balanceOfNft >= +daoDetails?.maxTokensPerUser) {
        setHasClaimed(true);
      } else {
        setHasClaimed(false);
      }
      const decimals = await getDecimals(Deposit_Token_Address);
      const symbol = await getTokenSymbol(Deposit_Token_Address);
      const name = await getTokenSymbol(Deposit_Token_Address);
      const userBalance = await getBalance(Deposit_Token_Address);

      setErc20TokenDetails({
        tokenSymbol: symbol,
        tokenName: name,
        tokenDecimal: decimals,

        userBalance: convertFromWeiGovernance(userBalance, decimals),
      });
    } catch (error) {
      console.log(error);
    }
  }, [Deposit_Token_Address, daoAddress]);

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const claimNFTHandler = async () => {
    try {
      setLoading(true);
      await approveDeposit(
        Deposit_Token_Address,
        FACTORY_CONTRACT_ADDRESS,
        convertFromWeiGovernance(
          clubData?.pricePerToken,
          erc20TokenDetails.tokenDecimal,
        ),
        erc20TokenDetails.tokenDecimal,
      );

      console.log(walletAddress, daoAddress, clubData?.imageUrl, count, []);

      await buyGovernanceTokenERC721DAO(
        walletAddress,
        daoAddress,
        clubData?.imageUrl,
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
    const fetchSubgraphData = async () => {
      const { stations } = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_CLUB_DETAILS(daoAddress),
      );

      setClubData(stations[0]);

      console.log("Data", stations);
      const imageUrl = await getImageURL(stations[0].imageUrl);
      setImgUrl(imageUrl);
    };

    fetchSubgraphData();
  }, [SUBGRAPH_URL, daoAddress]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  return (
    <div className={classes.pageContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.leftContainer}>
          <p className={classes.heading}>{clubData?.name}</p>
          <div className={classes.flexContainer}>
            {active ? (
              <p className={classes.isActive}>
                <div className={classes.activeIllustration}></div>
                Active
              </p>
            ) : (
              <p className={classes.isInactive}>
                <div className={classes.executedIllustration}></div>
                Finished
              </p>
            )}
            <p className={classes.createdBy}>
              {`${clubData?.ownerAddress?.slice(
                0,
                5,
              )}...${clubData?.ownerAddress?.slice(-5)}`}
            </p>
            <TbWorld size={30} className={classes.icons} />

            {clubInfo?.telegram && (
              <BiLogoTelegram
                size={30}
                className={classes.icons}
                onClick={() => {
                  window.open(clubInfo?.telegram, "_blank");
                }}
              />
            )}

            {clubInfo?.discord ? (
              <FaDiscord
                size={30}
                className={classes.icons}
                onClick={() => {
                  window.open(clubInfo?.discord, "_blank");
                }}
              />
            ) : null}

            {clubInfo?.twitter && (
              <FaTwitter
                size={30}
                className={classes.icons}
                onClick={() => {
                  window.open(clubInfo?.twitter, "_blank");
                }}
              />
            )}
          </div>
          <p className={classes.smallText}>Minting closes in</p>

          <div className={classes.timer}>
            <p>00</p>
            <p>00</p>
            <p>00</p>
            <p>00</p>
          </div>

          <div className={classes.priceContainer}>
            <p
              style={{
                marginBottom: "10px",
              }}
              className={classes.subtitle}>
              {clubData?.membersCount} collected out of{" "}
              {clubData?.raiseAmount === "0"
                ? "unlimited"
                : clubData?.raiseAmount}{" "}
              NFTs
            </p>
            <p
              style={{
                color: "#C1D3FE",
              }}
              className={classes.smallText}>
              Price
            </p>
            <p
              style={{
                marginBottom: "12px",
                padding: 0,
              }}
              className={classes.heading}>
              {convertFromWeiGovernance(clubData?.pricePerToken, 6)} USDC
            </p>

            <div
              style={{
                display: "flex",
              }}>
              <Grid spacing={3} className={classes.counterContainer}>
                <IconButton
                  onClick={() => {
                    count > 1 ? setCount(count - 1) : 1;
                  }}>
                  <RemoveIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                </IconButton>
                <Typography variant="h6" color="" sx={{ fontWeight: "bold" }}>
                  {count}
                </Typography>
                <IconButton
                  // onClick={() =>
                  //   count < daoDetails.maxTokensPerUser - balanceOfNft
                  //     ? setCount(count + 1)
                  //     : daoDetails.maxTokensPerUser
                  // }
                  onClick={() => {
                    setCount(count + 1);
                  }}
                  color="#000">
                  <AddIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
                </IconButton>
              </Grid>
              <Button
                onClick={claimNFTHandler}
                disabled={
                  (remainingDays <= 0 && remainingTimeInSecs < 0) || hasClaimed
                    ? true
                    : // : isTokenGated
                      // ? !isEligibleForTokenGating
                      false
                }
                sx={{ px: 8, borderRadius: "24px", py: "0.5rem" }}>
                {loading ? (
                  <CircularProgress />
                ) : hasClaimed ? (
                  "Minted"
                ) : (
                  "Mint"
                )}
              </Button>
            </div>
            <p
              style={{
                marginTop: "12px",
              }}
              className={classes.smallText}>
              Note: This station allows maximum of 1 mint(s) per address
            </p>
          </div>
        </div>
        <div className={classes.rightContainer}>
          {/* <img
            alt="nft img"
            height={500}
            width={500}
            src={imgUrl}
            style={{
              borderRadius: "20px",
            }}
          /> */}

          {imgUrl && (
            <>
              {imgUrl.includes(".mp4") ? (
                <video className={classes.nftImg} loop autoPlay muted>
                  <source src={imgUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={imgUrl}
                  alt="nft image"
                  height={500}
                  width={500}
                  style={{
                    borderRadius: "20px",
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {clubInfo?.bio ? (
        <div className={classes.mainContainer}>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "scroll",
              margin: "20px 0",
            }}>
            <div
              dangerouslySetInnerHTML={{
                __html: ReactHtmlParser(clubInfo?.bio),
              }}></div>
          </div>
        </div>
      ) : null}

      {showWrongNetworkModal(wallet, networkId)}

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
    </div>
  );
};

export default ERC721;

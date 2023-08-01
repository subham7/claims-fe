import { Alert } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import { subgraphQuery } from "../../../../utils/subgraphs";
import { QUERY_CLUB_DETAILS } from "../../../../api/graphql/queries";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  getImageURL,
} from "../../../../utils/globalFunctions";
import useSmartContractMethods from "../../../../hooks/useSmartContractMethods";
import { useConnectWallet } from "@web3-onboard/react";
import dayjs from "dayjs";
import About from "./About";
import NFTimg from "./NFTimg";
import PriceSection from "./PriceSection";
import Header from "./Header";
import { useRouter } from "next/router";

const ERC721 = ({
  daoAddress,
  clubInfo,
  isEligibleForTokenGating,
  isTokenGated,
  daoDetails,
  whitelistUserData,
}) => {
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
  const day2 = dayjs.unix(daoDetails?.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const {
    approveDeposit,
    buyGovernanceTokenERC721DAO,
    getDecimals,
    getTokenSymbol,
    getBalance,
  } = useSmartContractMethods();

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const Deposit_Token_Address = useSelector((state) => {
    return state.club.factoryData.depositTokenAddress;
  });

  const router = useRouter();

  const fetchTokenDetails = useCallback(async () => {
    try {
      const balance = await getBalance(daoAddress);
      setBalanceOfNft(balance);

      if (+balanceOfNft >= +clubData?.maxTokensPerUser) {
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
  }, [
    Deposit_Token_Address,
    balanceOfNft,
    daoAddress,
    clubData?.maxTokensPerUser,
  ]);

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

      await buyGovernanceTokenERC721DAO(
        walletAddress,
        daoAddress,
        clubData?.imageUrl,
        count,
        whitelistUserData?.proof ? whitelistUserData.proof : [],
      );
      setLoading(false);
      setClaimSuccessfull(true);
      router.push(`/dashboard/${daoAddress}`, undefined, {
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
      const response = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_CLUB_DETAILS(daoAddress),
      );

      if (response) {
        const { stations } = response;

        setClubData(stations[0]);

        const imageUrl = await getImageURL(stations[0].imageUrl);
        setImgUrl(imageUrl);
      }
    };
    if (daoAddress) {
      fetchSubgraphData();
    }
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
          <Header
            isErc20={false}
            active={active}
            clubData={clubData}
            clubInfo={clubInfo}
            deadline={daoDetails.depositDeadline}
            daoAddress={daoAddress}
          />
          <PriceSection
            claimNFTHandler={claimNFTHandler}
            clubData={clubData}
            count={count}
            hasClaimed={hasClaimed}
            loading={loading}
            remainingDays={remainingDays}
            remainingTimeInSecs={remainingTimeInSecs}
            setCount={setCount}
            balanceOfNft={balanceOfNft}
            isEligibleForTokenGating={isEligibleForTokenGating}
            isTokenGated={isTokenGated}
            whitelistUserData={whitelistUserData}
            nftMinted={daoDetails?.nftMinted}
          />
        </div>
        <NFTimg imgUrl={imgUrl} />
      </div>

      {clubInfo?.bio ? (
        <About bio={clubInfo?.bio} daoAddress={daoAddress} />
      ) : null}

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

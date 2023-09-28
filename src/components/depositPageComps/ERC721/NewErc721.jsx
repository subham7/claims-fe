import ClaimActivity from "@components/claims/ClaimActivity";
import Eligibility from "@components/claims/Eligibility";
import SocialButtons from "@components/common/SocialButtons";
import { Alert, Backdrop, CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DepositPreRequisites from "../DepositPreRequisites";
import DepositProgress from "../ERC20/DepositProgress";
import classes from "../../../components/claims/Claim.module.scss";
import { useSelector } from "react-redux";
import Header from "@components/claims/Header";
import About from "@components/claims/About";
import { getUploadedNFT } from "api/assets";
import { convertFromWeiGovernance, getImageURL } from "utils/globalFunctions";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import dayjs from "dayjs";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useAccount } from "wagmi";

const NewErc721 = ({
  daoAddress,
  clubInfo,
  isEligibleForTokenGating,
  isTokenGated,
  daoDetails,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
}) => {
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 6,
    tokenSymbol: "USDC",
    userBalance: 0,
    tokenName: name,
  });
  const [active, setActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [count, setCount] = useState(1);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails?.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const { address: walletAddress } = useAccount();

  const { approveDeposit, getDecimals, getTokenSymbol, getBalance } =
    useCommonContractMethods();

  const { buyGovernanceTokenERC721DAO } = useAppContractMethods();

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const Deposit_Token_Address = useSelector((state) => {
    return state.club.factoryData.depositTokenAddress;
  });

  const fetchActivities = async () => {
    try {
      const { users } = await queryLatestMembersFromSubgraph(
        daoAddress,
        networkId,
      );
      if (users) setMembers(users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokenDetails = async () => {
    try {
      if (Deposit_Token_Address && daoAddress) {
        const balance = await getBalance(daoAddress);
        setBalanceOfNft(balance);

        if (+balance >= +clubData?.maxTokensPerUser) {
          setHasClaimed(true);
        } else {
          setHasClaimed(false);
        }
        const decimals = await getDecimals(Deposit_Token_Address);
        const symbol = await getTokenSymbol(Deposit_Token_Address);
        const name = await getTokenSymbol(Deposit_Token_Address);
        const userBalance = await getBalance(Deposit_Token_Address);

        setTokenDetails({
          tokenSymbol: symbol,
          tokenName: name,
          tokenDecimal: decimals,
          userBalance: convertFromWeiGovernance(userBalance, decimals),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      router.push(`/dashboard/${daoAddress}/${networkId}`, undefined, {
        shallow: true,
      });
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setClaimSuccessfull(false);
      setLoading(false);
      showMessageHandler();
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, [Deposit_Token_Address, daoAddress]);

  useEffect(() => {
    const fetchSubgraphData = async () => {
      try {
        const imageUrl = await getUploadedNFT(daoAddress?.toLowerCase());
        if (imageUrl?.data.length) {
          setImgUrl(imageUrl?.data[0]?.imageUrl);
        } else {
          const imageUrl = await getImageURL(clubData?.imgUrl);
          setImgUrl(imageUrl);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (daoAddress) {
      fetchSubgraphData();
    }
  }, [clubData?.imgUrl, daoAddress, networkId]);

  useEffect(() => {
    if (daoAddress) {
      fetchActivities();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (new Date(day2).getTime() / 1000 >= new Date(day1).getTime() / 1000) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1, daoDetails?.depositDeadline]);

  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <Header
            contractData={clubData}
            deadline={daoDetails?.depositDeadline}
            tokenDetails={tokenDetails}
            isDeposit={true}
            isActive={active}
          />
          <DepositPreRequisites daoAddress={daoAddress} />
        </div>
        <SocialButtons isDeposit={true} data={clubInfo} />
      </section>

      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          <div className={classes.nftContainer}>
            <Image
              src={imgUrl}
              fill
              alt="Banner Image"
              className={classes.nftImage}
            />
          </div>
        </div>

        <DepositProgress
          nftMinted={daoDetails?.nftMinted}
          clubData={clubData}
          tokenDetails={tokenDetails}
        />

        {clubInfo?.bio && <About bio={clubInfo?.bio} />}

        {clubData && (
          <Eligibility
            gatedTokenDetails={gatedTokenDetails}
            isDeposit={true}
            isTokenGated={isTokenGated}
            isWhitelist={whitelistUserData?.setWhitelist}
          />
        )}

        <ClaimActivity
          isDeposit={true}
          activityDetails={members}
          tokenDetails={tokenDetails}
        />
      </section>

      {showMessage ? (
        <Alert
          severity={claimSuccessfull ? "success" : "error"}
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </main>
  );
};

export default NewErc721;

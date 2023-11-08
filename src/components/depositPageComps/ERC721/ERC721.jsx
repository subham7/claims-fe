import React, { useEffect, useState } from "react";
import DepositPreRequisites from "../DepositPreRequisites";
import { useSelector } from "react-redux";
import { getUploadedNFT } from "api/assets";
import { convertFromWeiGovernance, getImageURL } from "utils/globalFunctions";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import dayjs from "dayjs";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useAccount } from "wagmi";
import Mint from "./Mint";
import { useRouter } from "next/router";
import { getDocumentsByClubId } from "api/document";
import PublicPageLayout from "@components/common/PublicPageLayout";
import { CHAIN_CONFIG } from "utils/constants";

const DepositInputComponents = ({ depositPreRequisitesProps, mintProps }) => {
  return (
    <>
      <DepositPreRequisites {...depositPreRequisitesProps} />
      <Mint {...mintProps} />
    </>
  );
};

const ERC721 = ({
  daoAddress,
  clubInfo,
  isEligibleForTokenGating,
  isTokenGated,
  daoDetails,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
  depositConfig,
  isSignable,
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
  const [hasClaimed, setHasClaimed] = useState(false);
  const [balanceOfNft, setBalanceOfNft] = useState();
  const [message, setMessage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [count, setCount] = useState(1);
  const [claimSuccessfull, setClaimSuccessfull] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);
  const [uploadedDocInfo, setUploadedDocInfo] = useState({});

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails?.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const { address: walletAddress } = useAccount();
  const router = useRouter();

  const { approveDeposit, getDecimals, getTokenSymbol, getBalance } =
    useCommonContractMethods();

  const { buyGovernanceTokenERC721DAO } = useAppContractMethods({ daoAddress });

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
        CHAIN_CONFIG[networkId].factoryContractAddress,
        convertFromWeiGovernance(
          clubData?.pricePerToken,
          tokenDetails.tokenDecimal,
        ),
        tokenDetails.tokenDecimal,
      );

      await buyGovernanceTokenERC721DAO(
        walletAddress,
        clubData?.imageUrl,
        count,
        whitelistUserData?.proof ? whitelistUserData.proof : [],
      );
      setLoading(false);
      setClaimSuccessfull(true);
      router.push(`/dashboard/${daoAddress}/${networkId}`, undefined, {
        shallow: true,
      });
      setMessage("Transaction Successful");
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setClaimSuccessfull(false);
      setLoading(false);
      setMessage("Transaction Failed");
      showMessageHandler();
    }
  };

  const handleIsSignedChange = (newValue) => {
    setIsSigned(newValue);
  };

  const handleIsW8BenSignedChange = (newValue) => {
    setIsW8BenSigned(newValue);
  };

  const fetchDocs = async () => {
    try {
      const docList = await getDocumentsByClubId(daoAddress.toLowerCase());

      const document = docList.find(
        (doc) => doc.docIdentifier === depositConfig?.uploadDocId,
      );
      setUploadedDocInfo(document);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [daoAddress, depositConfig?.uploadDocId]);

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
    <PublicPageLayout
      clubData={clubData}
      tokenDetails={tokenDetails}
      headerProps={{
        contractData: clubData,
        deadline: daoDetails?.depositDeadline,
        tokenDetails: tokenDetails,
        isDeposit: true,
        isActive: active,
      }}
      inputComponents={
        <DepositInputComponents
          depositPreRequisitesProps={{
            uploadedDocInfo: uploadedDocInfo,
            daoAddress: daoAddress,
            onIsSignedChange: handleIsSignedChange,
            onIsW8BenSignedChange: handleIsW8BenSignedChange,
          }}
          mintProps={{
            claimNFTHandler: claimNFTHandler,
            clubData: clubData,
            count: count,
            hasClaimed: hasClaimed,
            remainingDays: remainingDays,
            remainingTimeInSecs: remainingTimeInSecs,
            setCount: setCount,
            balanceOfNft: balanceOfNft,
            isEligibleForTokenGating: isEligibleForTokenGating,
            isTokenGated: isTokenGated,
            whitelistUserData: whitelistUserData,
            isSigned: isSigned,
            isW8BenSigned: isW8BenSigned,
            isSignable: isSignable,
          }}
        />
      }
      socialData={clubInfo}
      imgUrl={imgUrl}
      isDeposit={true}
      bio={clubInfo?.bio}
      eligibilityProps={{
        gatedTokenDetails: gatedTokenDetails,
        isDeposit: true,
        isTokenGated: isTokenGated,
        isWhitelist: whitelistUserData?.setWhitelist,
      }}
      members={members}
      message={message}
      isSuccessfull={claimSuccessfull}
      loading={loading}
      showMessage={showMessage}
      nftMinted={daoDetails?.nftMinted}
    />
  );
};

export default ERC721;

import React, { useEffect, useState } from "react";
import SettingItem from "./SettingItem";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import TokenPriceInput from "./TokenPriceInput";
// import ImportAllowlist from "./ImportAllowlist";
import { useSelector } from "react-redux";
import BackdropLoader from "@components/common/BackdropLoader";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import { useRouter } from "next/router";
import DeadlineInput from "./DeadlineInput";
import TokenGatingList from "./TokenGatingList";
import KycSettings from "./KycSettings";
import useAppContractMethods from "hooks/useAppContractMethods";
import { getClubData } from "api/club";

const DepositSettings = ({ routeNetworkId, daoAddress, settingIsLoading }) => {
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState("");
  const [isActionCreated, setIsActionCreated] = useState(null);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [isKycEnabled, setIsKycEnabled] = useState(false);

  const { getTokenGatingDetails } = useAppContractMethods({
    daoAddress,
    routeNetworkId,
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const {
    minDepositAmountFormatted,
    maxDepositAmountFormatted,
    raiseAmountFormatted,
    pricePerTokenFormatted,
    symbol,
  } = clubData;

  const handleActionComplete = (result, proposalId = "") => {
    setIsActionCreated(result);
    setProposalId(proposalId);
  };

  const fetchTokenGatingDetails = async () => {
    const details = await getTokenGatingDetails();

    if (details && details?.tokens?.length) {
      setIsTokenGated(true);
    } else {
      setIsTokenGated(false);
    }
  };

  const fetchKycDetails = async () => {
    try {
      const response = await getClubData(daoAddress);
      if (response) {
        setIsKycEnabled(response.kyc.isKycEnabled);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchTokenGatingDetails();
    fetchKycDetails();
  }, [daoAddress]);

  const router = useRouter();

  const settingItems = [
    // {
    //   heading: "Allowlist users",
    //   description:
    //     "By allowlisting specific addresses, only these users will be able to deposit funds to your station. No other wallet will be able to make any deposit. You can either import addresses from a CSV file or manually copy and paste them here.",
    //   component: <ImportAllowlist />,
    // },
    {
      key: "enableKYC",
      heading: "KYC",
      description:
        "Enable/disable KYC for investors that are contributing funds to this station.",
      component: (
        <KycSettings
          setIsKycEnabledSettings={setIsKycEnabled}
          daoAddress={daoAddress}
          setLoading={setLoading}
        />
      ),
      isDisabled: !isKycEnabled,
      showStatusTag: true,
    },

    {
      heading: "Tokengating",
      description:
        "Manage the tokens that users will need to be eligible for joining this station. Setup existing NFTs or ERC20 tokens on any EVM compatible network as a qualifier to make a deposit. Read more about tokengating on StationX.",
      component: (
        <TokenGatingList
          setIsTokenGated={setIsTokenGated}
          setLoading={setLoading}
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
        />
      ),
      isDisabled: !isTokenGated,
      showStatusTag: true,
      isHidden: routeNetworkId !== "0xe708",
    },
    {
      heading: "Deadline",
      description:
        "Last date for members to deposit funds before the gates close.",
      component: (
        <DeadlineInput
          setLoading={setLoading}
          daoAddress={daoAddress}
          clubData={clubData}
        />
      ),
    },
    {
      heading: "Token Price",
      description:
        "Members receive these tokens when they deposit funds to the station. Tokens are minted automatically to users’ wallets as per the set price. These token(s) are non-transferrable, and only exist to represent their ownership in the station. You can learn more about memberships here.",
      component: (
        <TokenPriceInput
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(pricePerTokenFormatted?.formattedValue)}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          symbol={symbol}
          settingIsLoading={settingIsLoading}
        />
      ),
    },
    {
      heading: "Minimum deposit",
      description:
        "Minimum amount of funds a user can deposit into the station.",
      component: (
        <UpdateAmountTextfield
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(minDepositAmountFormatted?.formattedValue)}
          type="updateMinDeposit"
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          settingIsLoading={settingIsLoading}
        />
      ),
      isHidden: tokenType === "erc721",
    },
    {
      heading: "Maximum deposit",
      description:
        "Maximum amount of funds a user can deposit into the station.",
      component: (
        <UpdateAmountTextfield
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(maxDepositAmountFormatted?.formattedValue)}
          type="updateMaxDeposit"
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          settingIsLoading={settingIsLoading}
        />
      ),
      isHidden: tokenType === "erc721",
    },
    {
      heading: "Total Fundraise",
      description:
        "Station deposits close automatically when the funding target is met.",
      component: (
        <UpdateAmountTextfield
          type="updateRaiseAmount"
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          prevAmount={Number(raiseAmountFormatted?.formattedValue)}
          settingIsLoading={settingIsLoading}
        />
      ),
      isHidden: tokenType === "erc721",
    },
  ];

  return (
    <div>
      {settingItems.map((item, index) => (
        <SettingItem
          key={index}
          heading={item.heading}
          isHidden={item?.isHidden}
          description={item.description}
          isDisabled={item?.isDisabled}
          showStatusTag={item?.showStatusTag}>
          {item.component}
        </SettingItem>
      ))}

      <BackdropLoader isOpen={loading} />

      {isActionCreated === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setIsActionCreated(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            router.push(`/proposals/${daoAddress}/${routeNetworkId}`);
          }}
        />
      ) : isActionCreated === "failure" ? (
        <StatusModal
          heading={"Something went wrong"}
          subheading="Looks like we hit a bump here, try again?"
          isError={true}
          onClose={() => {
            setIsActionCreated(null);
          }}
          buttonText="Try Again?"
          onButtonClick={() => {
            setIsActionCreated(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default DepositSettings;

import React, { useState } from "react";
import SettingItem from "./SettingItem";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import TokenPriceInput from "./TokenPriceInput";
import ImportAllowlist from "./ImportAllowlist";
import { useSelector } from "react-redux";
import BackdropLoader from "@components/common/BackdropLoader";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import { useRouter } from "next/router";
import DeadlineInput from "./DeadlineInput";
import TokenGatingList from "./TokenGatingList";

const DepositSettings = ({ routeNetworkId, daoAddress }) => {
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState("");
  const [isActionCreated, setIsActionCreated] = useState(null);

  const clubData = useSelector((state) => {
    return state.club.clubData;
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

  const router = useRouter();

  return (
    <div>
      <SettingItem
        heading={"Allowlist users"}
        description={
          "By allowlisting specific addresses, only these users will be able to deposit funds to your station. No other wallet will be able to make any deposit. You can either import addresses from a CSV file or manually copy and paste them here."
        }>
        <ImportAllowlist />
      </SettingItem>

      <SettingItem
        heading={"Tokengating"}
        description={
          "Manage the tokens that users will need to be eligible for joining this station. Setup existing NFTs or ERC20 tokens on any EVM compatible network as a qualifier to make a deposit. Read more about tokengating on StationX."
        }>
        <TokenGatingList setLoading={setLoading} daoAddress={daoAddress} />
      </SettingItem>

      <SettingItem
        heading={"Deadline"}
        description={
          "Last date for members to deposit funds before the gates close."
        }>
        <DeadlineInput
          setLoading={setLoading}
          daoAddress={daoAddress}
          clubData={clubData}
        />
      </SettingItem>

      <SettingItem
        heading={"Token Price"}
        description={
          "Members receive these tokens when they deposit funds to the station. Tokens are minted automatically to users’ wallets as per the set price. These token(s) are non-transferrable, and only exist to represent their ownership in the station. You can learn more about memberships here."
        }>
        <TokenPriceInput
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(pricePerTokenFormatted?.formattedValue)}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          symbol={symbol}
        />
      </SettingItem>

      <SettingItem
        heading={"Minimum deposit"}
        description={
          "Minimum amount of funds a user can deposit into the station."
        }>
        <UpdateAmountTextfield
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(minDepositAmountFormatted?.formattedValue)}
          type="updateMinDeposit"
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
        />
      </SettingItem>

      <SettingItem
        heading={"Maximum deposit"}
        description={
          "Maximum amount of funds a user can deposit into the station."
        }>
        <UpdateAmountTextfield
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          prevAmount={Number(maxDepositAmountFormatted?.formattedValue)}
          type="updateMaxDeposit"
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
        />
      </SettingItem>

      <SettingItem
        heading={"Total Fundraise"}
        description={
          "Station deposits close automatically when the funding target is met."
        }>
        <UpdateAmountTextfield
          type="updateRaiseAmount"
          routeNetworkId={routeNetworkId}
          daoAddress={daoAddress}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          prevAmount={Number(raiseAmountFormatted?.formattedValue)}
        />
      </SettingItem>

      <BackdropLoader isOpen={loading} />

      {isActionCreated === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setIsActionCreated(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            router.push(
              `/proposals/${daoAddress}/${routeNetworkId}/${proposalId}`,
            );
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

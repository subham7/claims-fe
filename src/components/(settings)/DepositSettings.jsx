import React from "react";
import SettingItem from "./SettingItem";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import TokenPriceInput from "./TokenPriceInput";
import ImportAllowlist from "./ImportAllowlist";
import { useSelector } from "react-redux";

const DepositSettings = ({ routeNetworkId, daoAddress }) => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const {
    minDepositAmountFormatted,
    maxDepositAmountFormatted,
    raiseAmountFormatted,
    pricePerTokenFormatted,
    distributionAmountFormatted,
    depositTokenDecimal,
  } = clubData;

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
        }></SettingItem>

      <SettingItem
        heading={"Deadline"}
        description={
          "Last date for members to deposit funds before the gates close."
        }></SettingItem>

      <SettingItem
        heading={"Token Price"}
        description={
          "Members receive these tokens when they deposit funds to the station. Tokens are minted automatically to users’ wallets as per the set price. These token(s) are non-transferrable, and only exist to represent their ownership in the station. You can learn more about memberships here."
        }>
        <TokenPriceInput />
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
        />
      </SettingItem>

      <SettingItem
        heading={"Total Fundraise"}
        description={
          "Station deposits close automatically when the funding target is met."
        }>
        <UpdateAmountTextfield type="updateRaiseAmount" prevAmount={20900} />
      </SettingItem>
    </div>
  );
};

export default DepositSettings;

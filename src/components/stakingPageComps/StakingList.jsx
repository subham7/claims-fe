import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import StakingCard from "./StakingCard";
import classes from "./Staking.module.scss";
import { DEFI_PROPOSALS } from "utils/proposalConstants";
import { useNetwork } from "wagmi";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { CHAIN_CONFIG } from "utils/constants";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const StakingList = ({ daoAddress }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const [unstakeTokenBalance, setUnstakeTokenBalance] = useState(0);
  const [unstakeClipFinanceToken, setUnstakeClipFinanceToken] = useState(0);

  const { getBalance, getDecimals } = useCommonContractMethods();

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const fetchStargateStakedToken = async () => {
    try {
      const balance = await getBalance(
        CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
        gnosisAddress,
      );

      const decimals = await getDecimals(
        CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
      );

      setUnstakeTokenBalance(convertFromWeiGovernance(balance, decimals));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClipFinanceStakedToken = async () => {
    try {
      const balance = await getBalance(
        CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
        gnosisAddress,
      );

      const decimals = await getDecimals(
        CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
      );

      setUnstakeClipFinanceToken(convertFromWeiGovernance(balance, decimals));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStargateStakedToken();
    fetchClipFinanceStakedToken();
  }, [gnosisAddress]);

  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Featured Pools
      </Typography>

      <div className={classes.list}>
        {DEFI_PROPOSALS({
          clipFinanceStaked: Number(unstakeClipFinanceToken),
          stargateStaked: Number(unstakeTokenBalance),
          networkId,
        })
          .filter((item) => item.availableOnNetworkIds.includes(networkId))
          .map((item) => (
            <StakingCard
              apy={item.APY}
              image={item.logo}
              name={item.name}
              staked={item.staked}
              token={item.token}
              key={item.name}
              daoAddress={daoAddress}
              executionIds={item.executionIds}
              unstakeTokenAddress={item.unstakeTokenAddress}
            />
          ))}
      </div>
    </div>
  );
};

export default StakingList;

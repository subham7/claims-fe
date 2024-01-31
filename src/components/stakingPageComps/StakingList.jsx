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
  const [unstakeStaderToken, setUnstakeStaderToken] = useState(0);
  const [unstakeKelpToken, setUnstakeKelpToken] = useState(0);

  const { getBalance, getDecimals } = useCommonContractMethods();

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const fetchTokenBalance = async (tokenAddress) => {
    try {
      const balance = await getBalance(tokenAddress, gnosisAddress);
      const decimals = await getDecimals(tokenAddress);
      return convertFromWeiGovernance(balance, decimals);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      let stargateBalance = 0,
        clipFinanceBalance = 0,
        staderBalance = 0,
        kelpBalance = 0;

      if (networkId === "0xe708") {
        [stargateBalance, clipFinanceBalance] = await Promise.all([
          fetchTokenBalance(
            CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
          ),
          fetchTokenBalance(
            CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
          ),
        ]);
      } else if (networkId === "0x5") {
        staderBalance = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].staderETHxAddress,
        );
      } else if (networkId === "0x1") {
        kelpBalance = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].kelpRsETHAddress,
        );
      }

      setUnstakeTokenBalance(stargateBalance);
      setUnstakeClipFinanceToken(clipFinanceBalance);
      setUnstakeStaderToken(staderBalance);
      setUnstakeKelpToken(kelpBalance);
    };

    fetchBalances();
  }, [gnosisAddress, networkId]);

  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Featured Pools
      </Typography>

      <div className={classes.list}>
        {DEFI_PROPOSALS({
          clipFinanceStaked: Number(unstakeClipFinanceToken),
          stargateStaked: Number(unstakeTokenBalance),
          staderETHStaked: Number(unstakeStaderToken),
          kelpEthStaked: Number(unstakeKelpToken),
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

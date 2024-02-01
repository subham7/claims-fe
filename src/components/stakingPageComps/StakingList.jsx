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
import useAppContractMethods from "hooks/useAppContractMethods";

const StakingList = ({ daoAddress }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const [unstakeTokenBalance, setUnstakeTokenBalance] = useState(0);
  const [unstakeClipFinanceToken, setUnstakeClipFinanceToken] = useState(0);
  const [unstakeStaderToken, setUnstakeStaderToken] = useState(0);
  const [unstakeKelpToken, setUnstakeKelpToken] = useState(0);
  const [unstakeSwellRswETHToken, setUnstakeSwellRswETHToken] = useState(0);
  const [unstakeSwellEigenToken, setUnstakeSwellEigenToken] = useState(0);
  const [eigenTokensFetched, setEigenTokensFetched] = useState([]);

  const { getBalance, getDecimals } = useCommonContractMethods();
  const { fetchEigenTokenBalance } = useAppContractMethods({ daoAddress });

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

  const fetchEigenToken = async () => {
    try {
      const data = await fetchEigenTokenBalance(gnosisAddress);
      const convertedData = convertData(data);
      setEigenTokensFetched(convertedData);
    } catch (error) {
      console.log(error);
    }
  };

  const convertData = (data) => {
    const [addresses, amounts] = data;
    return addresses.map((address, index) => ({
      tokenAddress: address,
      amount: convertFromWeiGovernance(Number(amounts[index]), 18),
    }));
  };

  useEffect(() => {
    fetchEigenToken();
  }, [gnosisAddress]);

  useEffect(() => {
    const fetchBalances = async () => {
      let stargateBalance = 0,
        clipFinanceBalance = 0,
        staderBalance = 0,
        kelpBalance = 0,
        swellRswETH = 0,
        swellEigen = 0;

      if (networkId === "0xe708") {
        [stargateBalance, clipFinanceBalance] = await Promise.all([
          fetchTokenBalance(
            CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
          ),
          fetchTokenBalance(
            CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
          ),
        ]);
      } else if (networkId === "0x1") {
        const eigenBalances = {
          [CHAIN_CONFIG[networkId]?.staderETHxAddress?.toLowerCase()]:
            "staderBalance",
          [CHAIN_CONFIG[networkId]?.swellSwETHAddress?.toLowerCase()]:
            "swellEigen",
        };

        kelpBalance = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].kelpRsETHAddress,
        );

        swellRswETH = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].swellRswETHAddress,
        );

        eigenTokensFetched.forEach((token) => {
          const key = token.tokenAddress.toLowerCase();
          if (eigenBalances[key]) {
            if (eigenBalances[key] === "staderBalance") {
              staderBalance = token.amount;
            } else if (eigenBalances[key] === "swellEigen") {
              swellEigen = token.amount;
            }
          }
        });
      }

      setUnstakeTokenBalance(stargateBalance);
      setUnstakeClipFinanceToken(clipFinanceBalance);
      setUnstakeStaderToken(staderBalance);
      setUnstakeKelpToken(kelpBalance);
      setUnstakeSwellRswETHToken(swellRswETH);
      setUnstakeSwellEigenToken(swellEigen);
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
          swellRswEthStaked: Number(unstakeSwellRswETHToken),
          swellEigenEthStaked: Number(unstakeSwellEigenToken),
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
              isUnstakeDisabled={item.isUnstakeDisabled}
            />
          ))}
      </div>
    </div>
  );
};

export default StakingList;

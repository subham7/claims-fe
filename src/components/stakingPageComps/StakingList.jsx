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

const StakingList = ({ daoAddress, routeNeworkId }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const [unstakeTokenBalance, setUnstakeTokenBalance] = useState(0);
  const [unstakeClipFinanceToken, setUnstakeClipFinanceToken] = useState(0);
  const [unstakeStaderToken, setUnstakeStaderToken] = useState(0);
  const [unstakeKelpToken, setUnstakeKelpToken] = useState(0);
  const [unstakeSwellRswETHToken, setUnstakeSwellRswETHToken] = useState(0);
  const [unstakeSwellEigenToken, setUnstakeSwellEigenToken] = useState(0);
  const [unstakeRenzoEzETHToken, setUnstakeRenzoEzETHToken] = useState(0);
  const [unstakeLidoStETHToken, setUnstakeLidoStETHToken] = useState(0);
  const [unstakeRestakeRstETHToken, setUnstakeRestakeRstETHToken] = useState(0);
  const [unstakeRocketEigenToken, setUnstakeRocketEigenToken] = useState(0);
  const [unstakeMantleEigenToken, setUnstakeMantleEigenToken] = useState(0);
  const [unstakeLayerBankToken, setUnstakeLayerBankToken] = useState(0);

  const { getBalance, getDecimals } = useCommonContractMethods({
    routeNeworkId,
  });
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

      const [addresses, amounts] = data;

      const formattedData = addresses?.map((address, index) => ({
        tokenAddress: address,
        amount: convertFromWeiGovernance(Number(amounts[index]), 18),
      }));

      let staderBalance = 0,
        swellEigen = 0,
        lidoEigen = 0,
        mantleEigen = 0,
        rocketEigen = 0;

      formattedData.forEach((token) => {
        const key = token.tokenAddress.toLowerCase();
        if (
          key ===
          CHAIN_CONFIG[networkId]?.staderEigenStrategyAddress?.toLowerCase()
        ) {
          staderBalance = token.amount;
        } else if (
          key ===
          CHAIN_CONFIG[networkId]?.swellEigenStrategyAddress?.toLowerCase()
        ) {
          swellEigen = token.amount;
        } else if (
          key ===
          CHAIN_CONFIG[networkId]?.lidoEigenStrategyAddress?.toLowerCase()
        ) {
          lidoEigen = token.amount;
        } else if (
          key ===
          CHAIN_CONFIG[networkId]?.rocketEigenStrategyAddress?.toLowerCase()
        ) {
          rocketEigen = token.amount;
        } else if (
          key ===
          CHAIN_CONFIG[networkId]?.mantleEigenStrategyAddress?.toLowerCase()
        ) {
          mantleEigen = token.amount;
        }

        setUnstakeStaderToken(staderBalance);
        setUnstakeSwellEigenToken(swellEigen);
        setUnstakeRocketEigenToken(rocketEigen);
        setUnstakeMantleEigenToken(mantleEigen);
        setUnstakeLidoStETHToken(lidoEigen);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (gnosisAddress) fetchEigenToken();
  }, [gnosisAddress]);

  useEffect(() => {
    const fetchBalances = async () => {
      let stargateBalance = 0,
        clipFinanceBalance = 0,
        kelpBalance = 0,
        swellRswETH = 0,
        restakeRstETH = 0,
        renzoEzEthBalance = 0,
        layerBankEthBalance = 0;

      if (networkId === "0xe708") {
        [stargateBalance, clipFinanceBalance, layerBankEthBalance] =
          await Promise.all([
            fetchTokenBalance(
              CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
            ),
            fetchTokenBalance(
              CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
            ),
            fetchTokenBalance(CHAIN_CONFIG[networkId].layerBankToken),
          ]);
      } else if (networkId === "0x1") {
        renzoEzEthBalance = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].renzoEzETHAddress,
        );

        kelpBalance = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].kelpRsETHAddress,
        );

        swellRswETH = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].swellRswETHAddress,
        );

        restakeRstETH = await fetchTokenBalance(
          CHAIN_CONFIG[networkId].restakeRstETHAddress,
        );
      }

      setUnstakeTokenBalance(stargateBalance);
      setUnstakeClipFinanceToken(clipFinanceBalance);
      setUnstakeKelpToken(kelpBalance);
      setUnstakeSwellRswETHToken(swellRswETH);
      setUnstakeRenzoEzETHToken(renzoEzEthBalance);
      setUnstakeRestakeRstETHToken(restakeRstETH);
      setUnstakeLayerBankToken(layerBankEthBalance);
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
          renzoEzEthStaked: Number(unstakeRenzoEzETHToken),
          lidoEigenEthStaked: Number(unstakeLidoStETHToken),
          restakeRstETHStaked: Number(unstakeRestakeRstETHToken),
          rocketEigenStaked: Number(unstakeRocketEigenToken),
          mantleEigenStaked: Number(unstakeMantleEigenToken),
          layerBankStaked: Number(unstakeLayerBankToken),
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
              info={item.info}
              tags={item.tags}
              risk={item.risk}
            />
          ))}
      </div>
    </div>
  );
};

export default StakingList;

import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import StakingCard from "./StakingCard";
import classes from "./Staking.module.scss";
import {
  DEFI_PROPOSALS_ETH_POOLS,
  DEFI_PROPOSALS_PAIR_POOLS,
  DEFI_PROPOSALS_USDC_POOLS,
} from "utils/proposalConstants";
import { useNetwork } from "wagmi";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { CHAIN_CONFIG } from "utils/constants";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import useAppContractMethods from "hooks/useAppContractMethods";
import StakingTabs from "./StakingTabs";
import StakingPoolCard from "./StakingPoolCard";
import { fetchProposals } from "utils/proposal";
import { getPriceRate } from "api/assets";
import BigNumber from "bignumber.js";

const StakingList = ({ daoAddress, routeNeworkId }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const [tabType, setTabType] = useState("ETH");
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
  const [unstakeAaveScrollToken, setUnstakeAaveScrollToken] = useState(0);
  const [unstakeMendiUsdcToken, setUnstakeMendiUsdcToken] = useState(0);
  const [unstakeZeroLendToken, setUnstakeZeroLendToken] = useState(0);
  const [unstakeZeroLendUSDCToken, setUnstakeZeroLendUSDCToken] = useState(0);
  const [unstakeZeroLendNativeETHToken, setUnstakeZeroLendNativeETHToken] =
    useState(0);
  const [nileToken1Staked, setNileToken1Staked] = useState(0);
  const [nileToken2Staked, setNileToken2Staked] = useState(0);
  const [nileTotalPooled, setNileTotalPooled] = useState(0);
  const [unstakeClipFinanceEthToken, setUnstakeClipFinanceEthToken] =
    useState(0);

  const { getBalance, getDecimals } = useCommonContractMethods({
    routeNeworkId,
  });
  const { fetchEigenTokenBalance, fetchClipFinanceETHExchangeRate } =
    useAppContractMethods({ daoAddress });

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

  const tabChangeHandler = (event, newValue) => {
    setTabType(newValue);
  };

  const fetchBalances = async () => {
    let stargateBalance = 0,
      clipFinanceBalance = 0,
      kelpBalance = 0,
      swellRswETH = 0,
      restakeRstETH = 0,
      renzoEzEthBalance = 0,
      layerBankEthBalance = 0,
      aaveScrollEthBalance = 0,
      zeroLendEthBalance = 0,
      zeroLendUSDCBalance = 0,
      zeroLendNativeETHBalance = 0,
      clipFinanceEthBalance = 0,
      mendiUSDCBalance = 0;
    // mendiExchangeRate = 0;

    if (networkId === "0xe708") {
      [
        stargateBalance,
        clipFinanceBalance,
        layerBankEthBalance,
        mendiUSDCBalance,
        renzoEzEthBalance,
        zeroLendEthBalance,
        zeroLendUSDCBalance,
        zeroLendNativeETHBalance,
        clipFinanceEthBalance,
      ] = await Promise.all([
        fetchTokenBalance(
          CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0],
        ),
        fetchTokenBalance(
          CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
        ),
        fetchTokenBalance(CHAIN_CONFIG[networkId].layerBankToken),

        fetchTokenBalance(CHAIN_CONFIG[networkId].mendiTokenAddress),

        fetchTokenBalance(CHAIN_CONFIG[networkId].renzoEzETHAddress),

        fetchTokenBalance(CHAIN_CONFIG[networkId].zeroETHAddress),

        fetchTokenBalance(CHAIN_CONFIG[networkId].zeroUSDCAddress),

        fetchTokenBalance(CHAIN_CONFIG[networkId].zeroWETHAddress),

        fetchTokenBalance(CHAIN_CONFIG[networkId].clipFinanceETHPoolAddress),
      ]);
      const clipFinanceExchangeRate = await fetchClipFinanceETHExchangeRate();
      console.log("xxx", clipFinanceExchangeRate);

      const stakedEthClipFinanceBalance = BigNumber(clipFinanceExchangeRate)
        .times(BigNumber(clipFinanceEthBalance))
        .toString();

      setUnstakeClipFinanceEthToken(stakedEthClipFinanceBalance);
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
    } else if (networkId === "0x82750") {
      [aaveScrollEthBalance, layerBankEthBalance] = await Promise.all([
        fetchTokenBalance(CHAIN_CONFIG[networkId].aaveWrappedScrollEthAddress),
        fetchTokenBalance(CHAIN_CONFIG[networkId].layerBankToken),
      ]);
    }

    setUnstakeTokenBalance(stargateBalance);
    setUnstakeClipFinanceToken(clipFinanceBalance);
    setUnstakeKelpToken(kelpBalance);
    setUnstakeSwellRswETHToken(swellRswETH);
    setUnstakeRenzoEzETHToken(renzoEzEthBalance);
    setUnstakeRestakeRstETHToken(restakeRstETH);
    setUnstakeLayerBankToken(layerBankEthBalance);
    setUnstakeAaveScrollToken(aaveScrollEthBalance);
    setUnstakeMendiUsdcToken(mendiUSDCBalance);
    setUnstakeZeroLendToken(zeroLendEthBalance);
    setUnstakeZeroLendUSDCToken(zeroLendUSDCBalance);
    setUnstakeZeroLendNativeETHToken(zeroLendNativeETHBalance);
  };

  // temporary solution - @remove later
  const fetchProposalsList = async () => {
    let totalStakedToken1 = 0,
      totalStakedToken2 = 0;

    const data = await fetchProposals(daoAddress, "all");

    data
      .filter(
        (item) =>
          item?.commands[0]?.executionId === 63 && item?.status === "executed",
      )
      .map((item) => {
        totalStakedToken1 += Number(item?.commands[0]?.stakeToken1Amount);
        totalStakedToken2 += Number(item?.commands[0]?.stakeToken2Amount);
      });
    setNileToken1Staked(totalStakedToken1.toFixed(6));
    setNileToken2Staked(totalStakedToken2.toFixed(6));

    const ezETHData = await getPriceRate("ezeth");
    const ethData = await getPriceRate("eth");
    const ezETHToUSD = ezETHData.data?.data?.rates?.USDC;
    const ethToUSD = ethData?.data?.data?.rates?.USDC;

    const totalEzETHValue = totalStakedToken1 * Number(ezETHToUSD);
    const totalEthValue = totalStakedToken2 * Number(ethToUSD);

    const totalPoolValue = totalEthValue + totalEzETHValue;
    setNileTotalPooled(totalPoolValue);
  };

  useEffect(() => {
    fetchProposalsList();
  }, [daoAddress]);

  useEffect(() => {
    if (gnosisAddress) fetchEigenToken();
  }, [gnosisAddress]);

  useEffect(() => {
    if (gnosisAddress) fetchBalances();
  }, [gnosisAddress, networkId]);

  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Featured Pools
      </Typography>

      <StakingTabs tabType={tabType} onChange={tabChangeHandler} />

      <div className={classes.list}>
        {tabType === "ETH" ? (
          <>
            {DEFI_PROPOSALS_ETH_POOLS({
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
              aaveScrollStaked: Number(unstakeAaveScrollToken),
              renzoZerolLendStaked: Number(unstakeZeroLendToken),
              zeroLendNativeETHStaked: Number(unstakeZeroLendNativeETHToken),
              clipEthStaked: Number(unstakeClipFinanceEthToken),
              networkId,
            })
              .filter((item) =>
                item.availableOnNetworkIds.includes(routeNeworkId),
              )
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
          </>
        ) : tabType === "USDC" ? (
          <>
            {DEFI_PROPOSALS_USDC_POOLS({
              zeroLendUSDCStaked: Number(unstakeZeroLendUSDCToken),
              mendiStaked: Number(unstakeMendiUsdcToken),
              networkId,
            })
              .filter((item) =>
                item.availableOnNetworkIds.includes(routeNeworkId),
              )
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
          </>
        ) : (
          tabType === "PAIR" && (
            <>
              {DEFI_PROPOSALS_PAIR_POOLS({
                networkId,
                nileToken1Staked,
                nileToken2Staked,
              })
                .filter((item) =>
                  item.availableOnNetworkIds.includes(routeNeworkId),
                )
                .map((item) => (
                  <StakingPoolCard
                    apy={item.APY}
                    daoAddress={daoAddress}
                    executionIds={item.executionIds}
                    image={item.logo}
                    info={item.info}
                    isUnstakeDisabled={item.isUnstakeDisabled}
                    name={item.name}
                    risk={item.risk}
                    stakedToken1Details={item.stakedToken1}
                    stakedToken2Details={item.stakedToken2}
                    tags={item.tags}
                    key={item.name}
                    pooledValue={nileTotalPooled}
                  />
                ))}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default StakingList;

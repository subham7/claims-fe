import React, { useCallback, useEffect, useState } from "react";
import { SmartContract } from "../../src/api/contract";
import factoryContractABI from "../../src/abis/newArch/factoryContract.json";
import erc20DaoContractABI from "../../src/abis/newArch/erc20Dao.json";
import { NEW_FACTORY_ADDRESS } from "../../src/api";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";
import Layout2 from "../../src/components/layouts/layout2";
import NewArchERC20 from "../../src/components/depositPageComps/ERC20/NewArch/NewArchERC20";
import { useRouter } from "next/router";

const Join = () => {
  const [daoDetails, setDaoDetails] = useState({
    daoName: "",
    daoSymbol: "",
    quorum: 0,
    threshold: 0,
    isGovernance: false,
    isTokenGated: false,
    minDeposit: 0,
    maxDeposit: 0,
    totalSupply: 0,
    depositDeadline: 0,
    pricePerToken: 0,
    distributionAmt: 0,
    depositTokenAddress: "",
  });

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();

  const { piiid: erc20DaoAddress } = router.query;

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  /**
   * Deposit function for ERC20 comp
   */
  const fetchContractDetails = useCallback(async () => {
    const factoryContract = new SmartContract(
      factoryContractABI,
      NEW_FACTORY_ADDRESS,
      walletAddress,
      undefined,
      undefined,
    );

    const erc20DaoContract = new SmartContract(
      erc20DaoContractABI,
      erc20DaoAddress,
      walletAddress,
      undefined,
      undefined,
    );

    if (factoryContract && erc20DaoContract) {
      const factoryData = await factoryContract.getDAOdetails(erc20DaoAddress);
      const erc20Data = await erc20DaoContract.getERC20DAOdetails();

      if (erc20Data && factoryData)
        setDaoDetails({
          daoName: erc20Data.DaoName,
          daoSymbol: erc20Data.DaoSymbol,
          quorum: erc20Data.quorum,
          threshold: erc20Data.threshold,
          isGovernance: erc20Data.isGovernanceActive,
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,
          totalSupply:
            factoryData.distributionAmount * factoryData.pricePerToken,
        });
    }
  }, [erc20DaoAddress, walletAddress]);

  useEffect(() => {
    fetchContractDetails();
  }, [fetchContractDetails]);

  return (
    <Layout2>
      <NewArchERC20
        erc20DaoAddress={erc20DaoAddress}
        daoDetails={daoDetails}
      />
    </Layout2>
  );
};

export default Join;

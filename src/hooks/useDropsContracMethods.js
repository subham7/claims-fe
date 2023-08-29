import { useSelector } from "react-redux";
import { getIncreaseGasPrice } from "utils/helper";
import { useAccount, useNetwork } from "wagmi";

const useDropsContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const { claimContractCall, claimContractSend, claimFactoryContractSend } =
    contractInstances;

  const addMoreTokens = async (noOfTokens) => {
    return await claimContractSend.methods?.depositTokens(noOfTokens).send({
      from: walletAddress,
      gasPrice: await getIncreaseGasPrice(networkId),
    });
  };

  const claimContract = async (
    claimSettings,
    totalNoOfWallets,
    blockNumber,
    whitelistNetwork,
  ) => {
    return await claimFactoryContractSend?.methods
      ?.deployClaimContract(
        claimSettings,
        totalNoOfWallets,
        blockNumber,
        whitelistNetwork,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(networkId),
      });
  };

  const claimSettings = async () => {
    return await claimContractCall?.methods?.claimSettings().call();
  };

  const claimBalance = async () => {
    return await claimContractCall?.methods.claimBalance().call();
  };

  const toggleClaim = async () => {
    return await claimContractSend?.methods.toggleClaim().send({
      from: walletAddress,
      gasPrice: await getIncreaseGasPrice(networkId),
    });
  };

  const changeClaimsStartTimeAndEndTime = async (startTime, endTime) => {
    return await claimContractSend?.methods
      .changeStartAndEndTime(startTime, endTime)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(networkId),
      });
  };

  const rollbackTokens = async (amount, rollbackAddress) => {
    return await claimContractSend?.methods
      .rollbackTokens(amount, rollbackAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(networkId),
      });
  };

  const modifyStartAndEndTime = async (startTime, endTime) => {
    return await claimContractSend?.methods
      .changeStartAndEndTime(startTime, endTime)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(networkId),
      });
  };

  const claim = async (amount, reciever, merkleProof, encodedData) => {
    return await claimContractSend.methods
      .claim(amount, reciever, merkleProof, encodedData)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(networkId),
      });
  };

  const hasClaimed = async (walletAddress) => {
    return await claimContractCall?.methods.hasClaimed(walletAddress).call();
  };

  const claimAmount = async (walletAddress) => {
    return await claimContractCall?.methods.claimAmount(walletAddress).call();
  };

  const checkAmount = async (walletAddress) => {
    return await claimContractCall?.methods.checkAmount(walletAddress).call();
  };

  return {
    claimAmount,
    claim,
    checkAmount,
    hasClaimed,
    rollbackTokens,
    toggleClaim,
    claimBalance,
    claimSettings,
    claimContract,
    changeClaimsStartTimeAndEndTime,
    addMoreTokens,
    modifyStartAndEndTime,
  };
};

export default useDropsContractMethods;

// external imports
import Web3 from "web3";

// react imports
import { useRouter } from "next/router";
import { React, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// api imports
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club";
import { SmartContract } from "../../src/api/contract";
import { getMembersDetails } from "../../src/api/user";

// abi imports
import ImplementationContract from "../../src/abis/implementationABI.json";
import nft from "../../src/abis/nft.json";

// component imports
import ERC20Comp from "../../src/components/depositPageComps/ERC20/ERC20Comp";
import ERC721Comp from "../../src/components/depositPageComps/ERC721/ERC721Comp";
import SnackbarComp from "../../src/components/depositPageComps/Snackbar/SnackbarComp";
import Layout2 from "../../src/components/layouts/layout2";

// utils import
import {
  calculateDays,
  convertFromWei,
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";

import { checkNetwork } from "../../src/utils/wallet";

import { useConnectWallet } from "@web3-onboard/react";

import { updateDynamicAddress } from "../../src/api";
import {
  getBalanceOfToken,
  getTokensDecimalFromAddress,
} from "../../src/api/token";

const Join = (props) => {
  const router = useRouter();
  const { pid } = router.query;
  const daoAddress = pid;
  const dispatch = useDispatch();
  const [walletConnected, setWalletConnected] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [minDeposit, setMinDeposit] = useState(0);
  const [maxDeposit, setMaxDeposit] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [quoram, setQuoram] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [governorDataFetched, setGovernorDataFetched] = useState(false);
  const [clubId, setClubId] = useState(null);
  const [membersFetched, setMembersFetched] = useState(false);
  const [clubTokenMinted, setClubTokenMInted] = useState(0);
  const [members, setMembers] = useState(0);
  const [depositInitiated, setDepositInitiated] = useState(false);
  const [closingDays, setClosingDays] = useState(0);
  const [imageFetched, setImageFetched] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [gnosisAddress, setGnosisAddress] = useState(null);
  const [tokenType, setTokenType] = useState();
  const [priceOfNft, setPriceOfNft] = useState();
  const [clubName, setClubName] = useState();
  const [nftContractAddress, setnftContractAddress] = useState();
  const [nftContractOwner, setnftContractOwner] = useState();
  const [depositCloseDate, setDepositCloseDate] = useState();
  const [nftImageUrl, setnftImageUrl] = useState();
  const [nftMetadata, setnftMetadata] = useState();
  const [isDepositActive, setIsDepositActive] = useState();
  const [loading, setLoading] = useState(false);
  const [maxTokensPerUser, setMaxTokensPerUser] = useState();
  const [userNftBalance, setUserNftBalance] = useState();
  const [totalNftMinted, setTotalNftMinted] = useState(0);
  const [totalNftSupply, setTotalNftSupply] = useState();
  const [isNftSupplyUnlimited, setIsNftSupplyUnlimited] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [isGovernanceActive, setIsGovernanceActive] = useState();
  const [message, setMessage] = useState("");
  const [tokenGatingAmount, setTokenGatingAmount] = useState();
  const [tokenGatingAddress, setTokenGatingAddress] = useState(
    "0x0000000000000000000000000000000000000000",
  );
  const [userTokenBalance, setUserTokenBalance] = useState();

  const [{ wallet }, connect] = useConnectWallet();

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const walletAddress = wallet?.accounts[0].address;

  const [usdcTokenDecimal, setUsdcTokenDecimal] = useState(0);
  const [governanceConvertDecimal, setGovernanceConvertDecimal] = useState(0);

  useEffect(() => {
    if (wallet?.chains) updateDynamicAddress(wallet?.chains[0].id, dispatch);

    setUserDetails(walletAddress);
    localStorage.setItem("wallet", walletAddress);
    setWalletConnected(true);
  }, [dispatch, wallet?.chains, walletAddress]);

  // helper function
  const newContract = useCallback(
    (
      _customContractAddress,
      _implementationContract = ImplementationContract,
    ) => {
      const contract = new SmartContract(
        _implementationContract,
        _customContractAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      return contract;
    },
    [GNOSIS_TRANSACTION_URL, USDC_CONTRACT_ADDRESS],
  );

  useEffect(() => {
    const fetchCustomTokenDecimals = async () => {
      if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
        const usdcContract = newContract(USDC_CONTRACT_ADDRESS);
        const daoContract = newContract(daoAddress);

        await usdcContract.obtainTokenDecimals().then((result) => {
          setUsdcTokenDecimal(result);
        });
        await daoContract.obtainTokenDecimals().then((result) => {
          setGovernanceConvertDecimal(result);
        });
        console.log("Run sucessfully!");
      }
    };
    fetchCustomTokenDecimals();
  }, [daoAddress, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL, newContract]);

  useEffect(() => {
    const obtainWalletBalance = async () => {
      const usdc_contract = newContract(USDC_CONTRACT_ADDRESS);
      await usdc_contract.balanceOf().then(
        (result) => {
          // console.log("wallet balance", result);
          setWalletBalance(convertFromWei(parseInt(result), usdcTokenDecimal));
          setFetched(true);
        },
        (error) => {
          console.log("Failed to fetch wallet USDC", error);
        },
      );
    };
    obtainWalletBalance();
  }, [
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    newContract,
    usdcTokenDecimal,
    userDetails,
  ]);

  useEffect(() => {
    const fetchMembers = () => {
      if (clubId) {
        const membersData = getMembersDetails(clubId);
        membersData.then((result) => {
          if (result.status != 200) {
            setMembersFetched(false);
          } else {
            setMembers(result.data.length);
            setMembersFetched(true);
          }
        });
      }
    };
    const fetchClubData = async () => {
      const clubData = fetchClub(clubId);
      clubData.then((result) => {
        if (result.status != 200) {
          setImageFetched(false);
        } else {
          setImageUrl(result.data[0].imageUrl);
          setTokenType(result.data[0].tokenType);
          setImageFetched(true);
        }
      });
    };

    if (clubId) {
      fetchClubData();
    }
    fetchMembers();
  }, [clubId]);

  useEffect(() => {
    const tokenAPIDetailsRetrieval = async () => {
      let response = await fetchClubbyDaoAddress(pid);
      if (response.data.length > 0) {
        settokenAPIDetails(response.data);
        setClubId(response.data[0].clubId);
        setGnosisAddress(response.data[0].gnosisAddress);
        setClubName(response.data[0].name);
        setnftContractAddress(response.data[0].nftAddress);
        setnftMetadata(response.data[0].nftMetadataUrl);
        let imgUrl = response.data[0].nftImageUrl?.split("//");
        setnftImageUrl(response.data[0].nftImageUrl);
        setApiTokenDetailSet(true);
      } else {
        setApiTokenDetailSet(false);
      }
    };
    if (pid) {
      tokenAPIDetailsRetrieval();
    }
  }, [pid, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    const contractDetailsRetrieval = async () => {
      // console.log("in contract details retrival");
      if (
        daoAddress &&
        !governorDataFetched &&
        // !governorDetails &&
        userDetails &&
        USDC_CONTRACT_ADDRESS &&
        GNOSIS_TRANSACTION_URL &&
        usdcTokenDecimal
      ) {
        const governorDetailContract = newContract(daoAddress);
        // setDataFetched(true);
        setGovernorDataFetched(true);
        await governorDetailContract.obtainTokenDecimals().then((result) => {
          setGovernanceConvertDecimal(result);
        });

        await governorDetailContract.closeDate().then((result) => {
          setDepositCloseDate(result);
          setClosingDays(calculateDays(parseInt(result) * 1000));
        });
        await governorDetailContract.minDepositPerUser().then((result) => {
          setMinDeposit(convertFromWei(parseFloat(result), usdcTokenDecimal));
        });
        await governorDetailContract.maxDepositPerUser().then((result) => {
          setMaxDeposit(convertFromWei(parseInt(result), usdcTokenDecimal));
        });
        await governorDetailContract.totalRaiseAmount().then((result) => {
          setTotalDeposit(convertFromWeiGovernance(result, usdcTokenDecimal));
        });
        await governorDetailContract.obtainSymbol().then((result) => {
          // console.log("result", result);
          setTokenSymbol(result);
        });
        await governorDetailContract
          .gatingTokenAddress()
          .then(async (result) => {
            setTokenGatingAddress(result);
            if (result !== "0x0000000000000000000000000000000000000000") {
              const tokenDecimals = await getTokensDecimalFromAddress(result);
              const contract = new SmartContract(
                ImplementationContract,
                result,
                undefined,
                USDC_CONTRACT_ADDRESS,
                GNOSIS_TRANSACTION_URL,
              );
              console.log(contract);
              await contract.balanceOf().then((result) => {
                console.log("result", result);
                setUserTokenBalance(
                  convertFromWeiGovernance(result, tokenDecimals),
                );
              });
              // const gatedTokenUserBalance = await getBalanceOfToken(
              //   walletAddress,
              //   result,
              // );

              // setUserTokenBalance(gatedTokenUserBalance);

              await governorDetailContract
                .gatingTokenBalanceRequired()
                .then((result) => {
                  console.log(
                    "balance required",
                    convertFromWeiGovernance(result, tokenDecimals),
                  );
                  setTokenGatingAmount(
                    convertFromWeiGovernance(result, tokenDecimals),
                  );
                });
            }
          });

        const decimal =
          await await governorDetailContract.obtainTokenDecimals();
        const res = await await governorDetailContract.erc20TokensMinted();

        setClubTokenMInted(convertFromWeiGovernance(res, decimal));
      }
    };

    const erc721ContractDetails = async () => {
      const erc721DetailContract = newContract(daoAddress);
      const nftContract = newContract(nftContractAddress, nft);

      await erc721DetailContract.gatingTokenAddress().then(async (result) => {
        setTokenGatingAddress(result);
        if (result !== "0x0000000000000000000000000000000000000000") {
          // const gatedTokenUserBalance = await getBalanceOfToken(
          //   walletAddress,
          //   result,
          // );

          // setUserTokenBalance(gatedTokenUserBalance);
          const tokenDecimals = await getTokensDecimalFromAddress(result);
          const contract = new SmartContract(
            ImplementationContract,
            result,
            undefined,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
          );
          console.log(contract);
          await contract.balanceOf().then((result) => {
            console.log("result", result);
            setUserTokenBalance(
              convertFromWeiGovernance(result, tokenDecimals),
            );
          });
          await erc721DetailContract
            .gatingTokenBalanceRequired()
            .then((result) => {
              console.log(
                "balance required",
                convertFromWeiGovernance(result, tokenDecimals),
              );
              setTokenGatingAmount(
                convertFromWeiGovernance(result, tokenDecimals),
              );
            });
        }
      });

      await erc721DetailContract.quoram().then((result) => setQuoram(result));

      await erc721DetailContract
        .threshold()
        .then((result) => setThreshold(result));

      await erc721DetailContract
        .governanceDetails()
        .then((result) => setIsGovernanceActive(result));

      await erc721DetailContract.priceOfNft().then((result) => {
        // console.log("price of nfffftttt", result);
        // setPriceOfNft(convertFromWei(parseInt(result), usdcTokenDecimal));
        setPriceOfNft(result);
      });

      await erc721DetailContract
        .ownerAddress()
        .then((result) => setnftContractOwner(result));
      await erc721DetailContract
        .closeDate()
        .then((result) =>
          setDepositCloseDate(new Date(parseInt(result) * 1000).toString()),
        );
      await erc721DetailContract.closeDate().then((result) => {
        if (result >= Date.now()) {
          setIsDepositActive(false);
        } else {
          setIsDepositActive(true);
        }
      });

      await nftContract
        .maxTokensPerUser()
        .then((result) => setMaxTokensPerUser(result));

      await nftContract
        .balanceOfNft(userDetails)
        .then((result) => setUserNftBalance(result));

      await nftContract
        .nftOwnersCount()
        .then((result) => setTotalNftMinted(result));

      await nftContract
        .totalNftSupply()
        .then((result) => setTotalNftSupply(result));

      await nftContract
        .isNftTotalSupplyUnlimited()
        .then((result) => setIsNftSupplyUnlimited(result));
    };

    if (wallet) {
      if (tokenType === "erc721") {
        erc721ContractDetails();
      } else if (tokenType === "erc20NonTransferable") {
        contractDetailsRetrieval();
      }
    }
  }, [
    walletConnected,
    clubId,
    wallet,
    tokenType,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    governorDataFetched,
    daoAddress,
    userDetails,
    usdcTokenDecimal,
    governanceConvertDecimal,
    nftContractAddress,
    newContract,
    walletAddress,
  ]);

  const handleInputChange = (newValue) => {
    setDepositAmount(parseInt(newValue));
  };

  const handleMaxButtonClick = async (event) => {
    // value should be the maximum deposit value
    if (governorDataFetched) {
      setDepositAmount(maxDeposit);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleDialogClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleSwitchNetwork = async () => {
    const switched = await checkNetwork();
    if (switched) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Layout2 faucet={true}>
      {tokenType === "erc20NonTransferable" && (
        // ERC20
        <ERC20Comp
          apiTokenDetailSet={apiTokenDetailSet}
          closingDays={closingDays}
          clubTokenMinted={clubTokenMinted}
          dataFetched={dataFetched}
          depositAmount={depositAmount}
          depositCloseDate={depositCloseDate}
          depositInitiated={depositInitiated}
          governorDataFetched={governorDataFetched}
          handleConnectWallet={connect}
          handleDialogClose={handleDialogClose}
          handleInputChange={handleInputChange}
          handleMaxButtonClick={handleMaxButtonClick}
          handleSwitchNetwork={handleSwitchNetwork}
          imageFetched={imageFetched}
          imageUrl={imageUrl}
          maxDeposit={maxDeposit}
          members={members}
          minDeposit={minDeposit}
          open={open}
          tokenAPIDetails={tokenAPIDetails}
          // tokenDetails={tokenDetails}
          tokenSymbol={tokenSymbol}
          totalDeposit={totalDeposit}
          wallet={wallet}
          walletBalance={walletBalance}
          walletConnected={walletConnected}
          clubId={clubId}
          daoAddress={daoAddress}
          setAlertStatus={setAlertStatus}
          setDepositInitiated={setDepositInitiated}
          setOpenSnackBar={setOpenSnackBar}
          usdcTokenDecimal={usdcTokenDecimal}
          userDetails={userDetails}
          newContract={newContract}
          clubName={clubName}
          tokenGatingAddress={tokenGatingAddress}
          tokenGatingAmount={tokenGatingAmount}
          userTokenBalance={userTokenBalance}
        />
      )}
      {tokenType === "erc721" && (
        // erc721 comp
        <ERC721Comp
          wallet={wallet}
          loading={loading}
          quoram={quoram}
          threshold={threshold}
          clubName={clubName}
          maxTokensPerUser={maxTokensPerUser}
          isDepositActive={isDepositActive}
          isGovernanceActive={isGovernanceActive}
          isNftSupplyUnlimited={isNftSupplyUnlimited}
          nftContractOwner={nftContractOwner}
          nftImageUrl={nftImageUrl}
          priceOfNft={priceOfNft}
          totalNftMinted={totalNftMinted}
          totalNftSupply={totalNftSupply}
          depositCloseDate={depositCloseDate}
          clubId={clubId}
          daoAddress={daoAddress}
          nftMetadata={nftMetadata}
          setAlertStatus={setAlertStatus}
          setLoading={setLoading}
          setMessage={setMessage}
          setOpenSnackBar={setOpenSnackBar}
          usdcTokenDecimal={usdcTokenDecimal}
          userDetails={userDetails}
          userNftBalance={userNftBalance}
          walletBalance={walletBalance}
          newContract={newContract}
          tokenGatingAddress={tokenGatingAddress}
          tokenGatingAmount={tokenGatingAmount}
          userTokenBalance={userTokenBalance}
        />
      )}
      <SnackbarComp
        alertStatus={alertStatus}
        handleClose={handleClose}
        message={message}
        openSnackBar={openSnackBar}
      />
    </Layout2>
  );
};

export default Join;

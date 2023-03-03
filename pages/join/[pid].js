// external imports
import Web3 from "web3";

// react imports
import { useRouter } from "next/router";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// api imports
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club";
import { SmartContract } from "../../src/api/contract";
import { createUser } from "../../src/api/user";
import {
  checkUserByClub,
  getMembersDetails,
  patchUserBalance,
} from "../../src/api/user";

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
  calculateTreasuryTargetShare,
  convertAmountToWei,
  convertFromWei,
  convertFromWeiGovernance,
  convertToWei,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";
import { connectWallet, onboard } from "../../src/utils/wallet";
import { checkNetwork } from "../../src/utils/wallet";

const Join = (props) => {
  const router = useRouter();
  const { pid } = router.query;
  const daoAddress = pid;
  const dispatch = useDispatch();
  const [walletConnected, setWalletConnected] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] =
    useState(null);
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
  const [tokenDetails, settokenDetails] = useState(null);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [governorDetails, setGovernorDetails] = useState(null);
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
  const [count, setCount] = useState(1);
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

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const wallet = useSelector((state) => {
    return state.create.value;
  });
  // console.log("wallet addresssssss", wallet);
  const [usdcTokenDecimal, setUsdcTokenDecimal] = useState(0);
  const [governanceConvertDecimal, setGovernanceConvertDecimal] = useState(0);

  const fetchCustomTokenDecimals = async () => {
    if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
      const usdcContract = new SmartContract(
        ImplementationContract,
        USDC_CONTRACT_ADDRESS,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      const daoContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      await usdcContract.obtainTokenDecimals().then((result) => {
        setUsdcTokenDecimal(result);
      });
      await daoContract.obtainTokenDecimals().then((result) => {
        setGovernanceConvertDecimal(result);
      });
    }
  };
  // console.log(walletConnected);
  const checkConnection = async () => {
    // console.log("wallet connection check");
    if (window.ethereum) {
      // console.log("in hereeee");
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      // console.log("in elsee");
      window.web3 = new Web3(window.web3.currentProvider);
    }

    try {
      let accounts = await window.web3.eth.getAccounts();
      // console.log("in hereeee", accounts);
      localStorage.setItem("wallet", accounts[0]);
      setUserDetails(accounts[0]);

      setWalletConnected(true);

      return true;
    } catch (err) {
      setUserDetails(null);
      setWalletConnected(false);
      return false;
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

  const tokenDetailsRetrieval = async () => {
    if (
      tokenAPIDetails &&
      tokenAPIDetails.length > 0 &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const tokenDetailContract = await new SmartContract(
        ImplementationContract,
        tokenAPIDetails[0].daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      await tokenDetailContract.tokenDetails().then(
        async (result) => {
          settokenDetails(result);
          setClubTokenMInted(
            convertFromWeiGovernance(result[2], governanceConvertDecimal),
          );
          setQuoram(
            convertFromWeiGovernance(result[2], governanceConvertDecimal),
          );
          setDataFetched(true);
        },
        (error) => {
          console.log(error);
        },
      );
    }
  };

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

  const erc721ContractDetails = async () => {
    const erc721DetailContract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    const nftContract = new SmartContract(
      nft,
      nftContractAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );

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

  const contractDetailsRetrieval = async () => {
    // console.log("in contract details retrival");
    if (
      daoAddress &&
      !governorDataFetched &&
      !governorDetails &&
      userDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const governorDetailContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
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

      await governorDetailContract.erc20TokensMinted().then((result) => {
        setClubTokenMInted(
          convertFromWeiGovernance(result, governanceConvertDecimal),
        );
      });

      // await governorDetailContract.getGovernorDetails().then(
      //   (result) => {
      //     console.log(result);
      //     setGovernorDetails(result);
      //     setMinDeposit(
      //       convertFromWei(parseFloat(result[1]), usdcTokenDecimal),
      //     );
      //     setMaxDeposit(convertFromWei(parseInt(result[2]), usdcTokenDecimal));
      //     setTotalDeposit(
      //       convertFromWei(parseInt(result[4]), usdcTokenDecimal),
      //     );

      //     setClosingDays(
      //       Math.round(
      //         (new Date(parseInt(result[0]) * 1000) - new Date()) /
      //           (1000 * 60 * 60 * 24),
      //       ),
      //     );
      //     setGovernorDataFetched(true);
      //   },
      //   (error) => {
      //     console.log(error);
      //   },
      // );
    }
  };

  const obtainWalletBalance = async () => {
    if (
      // !fetched &&
      userDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const usdc_contract = new SmartContract(
        ImplementationContract,
        USDC_CONTRACT_ADDRESS,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
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
    }
  };

  const handleConnectWallet = () => {
    // console.log("in handleConnectWallet");
    try {
      const wallet = connectWallet(dispatch);
      wallet.then((response) => {
        if (response) {
          setWalletConnected(true);
        } else {
          setWalletConnected(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   const web3 = new Web3(Web3.givenProvider)
  //   const networkIdRK = "4"
  //   web3.eth.net
  //     .getId()
  //     .then((networkId) => {
  //       if (networkId != networkIdRK) {
  //         setOpen(true)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  useEffect(() => {
    if (pid) {
      tokenAPIDetailsRetrieval();
    }
  }, [pid, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    if (
      tokenAPIDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      tokenType === "erc20NonTransferable"
    ) {
      contractDetailsRetrieval();
      // tokenDetailsRetrieval();
    }
  }, [tokenAPIDetails, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    // console.log("wallet", wallet);
    if (wallet !== null) {
      console.log("wallet", wallet);
      setPreviouslyConnectedWallet(wallet[0][0].address);
      setUserDetails(wallet[0][0].address);
    }
  }, [previouslyConnectedWallet]);

  useEffect(() => {
    if (clubId) {
      fetchClubData();
    }

    if (previouslyConnectedWallet) {
      // console.log("previously connected wallet");
      onboard.connectWallet({ autoSelect: wallet });
    }
    // console.log("wallettttt", wallet);
    if (checkConnection() && walletConnected && wallet) {
      // console.log("does it run?");
      obtainWalletBalance();

      if (tokenType === "erc721") {
        erc721ContractDetails();
      } else if (tokenType === "erc20NonTransferable") {
        contractDetailsRetrieval();
      }
      fetchMembers();
    }
  }, [previouslyConnectedWallet, walletConnected, clubId, wallet, tokenType]);

  useEffect(() => {
    fetchCustomTokenDecimals();
  }, [daoAddress, USDC_CONTRACT_ADDRESS]);

  const handleDeposit = async () => {
    setDepositInitiated(true);
    const checkUserExists = checkUserByClub(userDetails, clubId);
    const depositAmountConverted = convertToWei(
      depositAmount,
      usdcTokenDecimal,
    );
    checkUserExists.then((result) => {
      if (result.data === false) {
        // if the user doesn't exist
        const usdc_contract = new SmartContract(
          ImplementationContract,
          USDC_CONTRACT_ADDRESS,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const dao_contract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const usdc_response = usdc_contract.approveDeposit(
          daoAddress,
          depositAmountConverted,
          usdcTokenDecimal,
        );
        usdc_response.then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              depositAmountConverted,
              "",
            );
            deposit_response.then((result) => {
              const data = {
                userAddress: userDetails,
                clubs: [
                  {
                    clubId: clubId,
                    isAdmin: 0,
                    balance: depositAmountConverted,
                  },
                ],
              };
              const createuser = createUser(data);
              createuser.then((result) => {
                if (result.status !== 201) {
                  console.log("Error", result);
                  setAlertStatus("error");
                  setOpenSnackBar(true);
                } else {
                  setAlertStatus("success");
                  setOpenSnackBar(true);
                  router.push(`/dashboard/${clubId}`, undefined, {
                    shallow: true,
                  });
                }
              });
            });
          },
          (error) => {
            console.log("Error", error);
            setAlertStatus("error");
            setOpenSnackBar(true);
          },
        );
      } else {
        // if user exists
        const usdc_contract = new SmartContract(
          ImplementationContract,
          USDC_CONTRACT_ADDRESS,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const dao_contract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const usdc_response = usdc_contract.approveDeposit(
          daoAddress,
          depositAmountConverted,
          usdcTokenDecimal,
        );
        usdc_response.then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              depositAmountConverted,
              "",
            );
            deposit_response.then((result) => {
              const patchData = {
                userAddress: userDetails,
                clubId: clubId,
                balance: depositAmountConverted,
              };
              const updateDepositAmount = patchUserBalance(patchData);
              updateDepositAmount.then((result) => {
                if (result.status != 200) {
                  console.log("Error", result);
                  setAlertStatus("error");
                  setOpenSnackBar(true);
                } else {
                  setAlertStatus("success");
                  setOpenSnackBar(true);
                  router.push(`/dashboard/${clubId}`, undefined, {
                    shallow: true,
                  });
                }
              });
            });
          },
          (error) => {
            console.log("Error", error);
            setAlertStatus("error");
            setOpenSnackBar(true);
          },
        );
      }
    });
  };

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
          handleConnectWallet={handleConnectWallet}
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
          tokenDetails={tokenDetails}
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

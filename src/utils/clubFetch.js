import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchClub } from "../api/club";
import {
  addClubID,
  addClubName,
  addClubRoute,
  addDaoAddress,
  addWallet,
  addTokenAddress,
  addClubImageUrl,
} from "../redux/reducers/create";
import { checkNetwork } from "./wallet";
import { loginToken, refreshToken } from "../api/auth";
import { authenticateUser } from "./auth";
import {
  getExpiryTime,
  getJwtToken,
  getRefreshToken,
  setExpiryTime,
  setJwtToken,
  setRefreshToken,
} from "./auth";
import {
  addSafeAddress,
  setAdminUser,
  setGovernanceTokenDetails,
  setUSDCTokenDetails,
  setGovernanceAllowed,
} from "../redux/reducers/gnosis";
import { fetchConfig } from "../api/config";
import { fetchConfigById } from "../api/config";
import { addContractAddress } from "../redux/reducers/gnosis";
import { SmartContract } from "../api/contract";
import ImplementationContract from "../abis/implementationABI.json";
import { disconnectWallet, onboard } from "./wallet";
import { CleaningServices } from "@mui/icons-material";

const ClubFetch = (Component) => {
  const RetrieveDataComponent = () => {
    const router = useRouter();
    const { clubId } = router.query;
    const [tokenDecimalUsdc, setTokenDecimalUsdc] = useState("");
    const [tokenDecimalGovernance, setTokenDecimalGovernance] = useState("");
    const daoAddress = useSelector((state) => {
      return state.create.daoAddress;
    });
    const dispatch = useDispatch();
    const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
      return state.gnosis.factoryContractAddress;
    });
    const USDC_CONTRACT_ADDRESS = useSelector((state) => {
      return state.gnosis.usdcContractAddress;
    });
    const GNOSIS_TRANSACTION_URL = useSelector((state) => {
      return state.gnosis.transactionUrl;
    });
    const wallet = useSelector((state) => {
      return state.user.wallet;
    });
    // const dispatch = useDispatch();
    // const [address, setAddress] = useState(null);

    // useEffect(() => {
    //   const web3 = new Web3(Web3.givenProvider);
    //   web3.eth.getProvider().on("accountsChanged", function (accounts) {
    //     console.log("Accounts changed : ", accounts);
    //     setAddress(accounts[0]);
    //     //call your function here
    //   });
    // }, []);

    async function redirectUser() {
      console.log("redirect user", localStorage.getItem("label"));

      // await onboard.disconnectWallet({ label: localStorage.getItem("label") });
      // await disconnectWallet(dispatch);

      if (router.pathname === "/") {
        router.reload();
      } else {
        router.push("/");
      }
    }

    useEffect(async () => {
      await window.ethereum.on("accountsChanged", function () {
        redirectUser();
      });
    }, []);

    // useEffect(() => {
    //   const web3 = new Web3(Web3.givenProvider);

    //   async function detectWalletChange() {
    //     // get the user's current address
    //     const [newAddress] = await web3.eth.getAccounts();
    //     //console.log("address", address, newAddress);

    //     // check if the address has changed
    //     if (newAddress !== address && address !== null) {
    //       clearTimeout(detectWalletChangeTimeout);
    //       setAddress(newAddress);
    //       redirectUser();
    //       return;
    //     }
    //     setAddress(newAddress);

    //     // call the function again in 1 second
    //     let detectWalletChangeTimeout = setTimeout(detectWalletChange, 1000);
    //   }

    //   detectWalletChange();
    // }, [address]);

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
          setTokenDecimalUsdc(result);
        });
        await daoContract.obtainTokenDecimals().then((result) => {
          setTokenDecimalGovernance(result);
        });
      }
    };

    useEffect(() => {
      if (tokenDecimalGovernance && tokenDecimalUsdc) {
        dispatch(setGovernanceTokenDetails(tokenDecimalGovernance));
        dispatch(
          setUSDCTokenDetails({
            // TODO: token symbol should be dynamic, obtain it from api
            tokenSymbol: "USDC",
            tokenDecimal: tokenDecimalUsdc,
          }),
        );
      }
    }, [tokenDecimalGovernance, tokenDecimalUsdc]);

    const checkUserExists = () => {
      if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
        const checkUserInClub = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        const response = checkUserInClub.userDetails();
        response.then(
          (result) => {
            if (result[2]) {
              dispatch(setAdminUser(true));
            } else {
              dispatch(setAdminUser(false));
            }
            if (!result[0]) {
              router.push("/");
            }
          },
          (error) => {
            router.push("/");
          },
        );
      }
    };

    const checkGovernanceExists = () => {
      if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
        const checkGovernance = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        const response = checkGovernance.governanceDetails();
        // console.log(response);
        response.then((result) => {
          console.log(result);
          dispatch(setGovernanceAllowed(result));
        });
      }
    };

    useEffect(() => {
      checkUserExists();
      checkGovernanceExists();
      fetchCustomTokenDecimals();
      if (
        authenticateUser(
          clubId,
          localStorage.getItem("wallet"),
          daoAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        )
      ) {
        router.push("/");
      }
    }, [daoAddress, USDC_CONTRACT_ADDRESS]);

    useEffect(() => {
      // const switched = checkNetwork()
      if (clubId) {
        const networkData = fetchConfig();
        networkData.then((networks) => {
          if (networks.status != 200) {
            console.log(result.error);
          } else {
            const networksAvailable = [];
            networks.data.forEach((network) => {
              networksAvailable.push(network.networkId);
            });
            const web3 = new Web3(Web3.givenProvider);
            web3.eth.net
              .getId()
              .then((networkId) => {
                if (!networksAvailable.includes(networkId)) {
                  setOpen(true);
                }
                const networkData = fetchConfigById(networkId);
                networkData.then((result) => {
                  if (result.status != 200) {
                    console.log(result.error);
                  } else {
                    dispatch(
                      addContractAddress({
                        factoryContractAddress:
                          result.data[0].factoryContractAddress,
                        usdcContractAddress: result.data[0].usdcContractAddress,
                        transactionUrl: result.data[0].gnosisTransactionUrl,
                        networkHex: result.data[0].networkHex,
                        networkId: result.data[0].networkId,
                        networkName: result.data[0].name,
                      }),
                    );
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });

        const clubData = fetchClub(clubId);
        clubData.then((result) => {
          if (result.status !== 200) {
          } else {
            if (wallet) {
              router.push("/");
            } else {
              const checkedwallet = Web3.utils.toChecksumAddress(
                wallet?.accounts[0].address,
              );
              const getLoginToken = loginToken(wallet);
              getLoginToken.then((response) => {
                if (response.status !== 200) {
                  console.log(response.data.error);
                  router.push("/");
                } else {
                  setExpiryTime(response.data.tokens.access.expires);
                  const expiryTime = getExpiryTime();
                  const currentDate = Date();
                  setJwtToken(response.data.tokens.access.token);
                  setRefreshToken(response.data.tokens.refresh.token);
                  if (expiryTime < currentDate) {
                    const obtainNewToken = refreshToken(
                      getRefreshToken(),
                      getJwtToken(),
                    );
                    obtainNewToken
                      .then((tokenResponse) => {
                        if (response.status !== 200) {
                          console.log(tokenResponse.data.error);
                        } else {
                          setExpiryTime(
                            tokenResponse.data.tokens.access.expires,
                          );
                          setJwtToken(tokenResponse.data.tokens.access.token);
                          setRefreshToken(
                            tokenResponse.data.tokens.refresh.token,
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }
              });
              console.log(result.data[0]);
              dispatch(addWallet(checkedwallet));
              dispatch(addClubID(result.data[0].clubId));
              dispatch(addClubName(result.data[0].name));
              dispatch(addClubRoute(result.data[0].route));
              dispatch(addDaoAddress(result.data[0].daoAddress));
              dispatch(addTokenAddress(result.data[0].tokenAddress));
              dispatch(addClubImageUrl(result.data[0].imageUrl));
              dispatch(addSafeAddress(result.data[0].gnosisAddress));
            }
          }
        });
      }
      checkUserExists();
    }, [clubId]);

    return <Component />;
  };
  return RetrieveDataComponent;
};

export default ClubFetch;

import React, { useState, useEffect, useCallback } from "react";
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

import { useConnectWallet } from "@web3-onboard/react";
import { addWalletAddress } from "../redux/reducers/user";

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
    // const wallet = useSelector((state) => {
    //   return state.user.wallet;
    // });
    const [{ wallet }] = useConnectWallet();

    if (wallet) {
      localStorage.setItem("wallet", wallet?.accounts[0].address);
    }
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

    // async function redirectUser() {
    //   if (router.pathname === "/") {
    //     router.reload();
    //   } else {
    //     // router.push("/");
    //   }
    // }

    // useEffect(async () => {
    //   redirectUser();
    // }, [wallet]);

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
    }, [dispatch, tokenDecimalGovernance, tokenDecimalUsdc]);

    const checkUserExists = useCallback(() => {
      if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
        const checkUserInClub = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        const response = checkUserInClub.userDetails();
        console.log("responseeeeeeee", response);
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
    }, [
      GNOSIS_TRANSACTION_URL,
      USDC_CONTRACT_ADDRESS,
      daoAddress,
      dispatch,
      router,
    ]);

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
      if (!wallet) {
        // router.push("/");
      }
      // if (
      //   authenticateUser(
      //     clubId,
      //     wallet?.accounts[0].address,
      //     daoAddress,
      //     USDC_CONTRACT_ADDRESS,
      //     GNOSIS_TRANSACTION_URL,
      //   )
      // ) {
      //   router.push("/");
      // }
    }, [daoAddress, USDC_CONTRACT_ADDRESS, wallet]);

    useEffect(() => {
      // const switched = checkNetwork()
      if (clubId && wallet) {
        console.log("clubid", clubId);
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
                    console.log(
                      "usdcContractAddress",
                      result.data[0].usdcContractAddress,
                    );
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
            if (!wallet) {
              router.push("/");
            } else {
              const checkedwallet = wallet?.accounts[0].address;

              const getLoginToken = loginToken(checkedwallet);
              getLoginToken.then((response) => {
                if (response.status !== 200) {
                  console.log(response.data.error);
                  // router.push("/");
                } else {
                  setExpiryTime(response.data.tokens.access.expires);
                  const expiryTime = getExpiryTime();
                  const currentDate = Date();
                  setJwtToken(response.data.tokens.access.token);
                  setRefreshToken(response.data.tokens.refresh.token);
                  // if (expiryTime < currentDate) {
                  //   const obtainNewToken = refreshToken(
                  //     getRefreshToken(),
                  //     getJwtToken(),
                  //   );
                  //   obtainNewToken
                  //     .then((tokenResponse) => {
                  //       if (response.status !== 200) {
                  //         console.log(tokenResponse.data.error);
                  //       } else {
                  //         setExpiryTime(
                  //           tokenResponse.data.tokens.access.expires,
                  //         );
                  //         setJwtToken(tokenResponse.data.tokens.access.token);
                  //         setRefreshToken(
                  //           tokenResponse.data.tokens.refresh.token,
                  //         );
                  //       }
                  //     })
                  //     .catch((error) => {
                  //       console.log(error);
                  //     });
                  // }
                }
              });

              dispatch(addWalletAddress(checkedwallet));
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
    }, [checkUserExists, clubId, dispatch, router, wallet]);

    return <Component />;
  };
  return RetrieveDataComponent;
};

export default ClubFetch;

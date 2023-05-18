import React, { createContext, useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { connectWallet } from "../utils/wallet";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Button, Typography } from "@mui/material";
import { loginToken, refreshToken } from "../api/auth";
import { fetchConfig } from "../api/config";
import { updateDynamicAddress } from "../api";
import Web3 from "web3";
import { SmartContract } from "../api/contract";
import ImplementationContract from "../abis/implementationABI.json";
import { setUSDCTokenDetails } from "../redux/reducers/gnosis";
import { getAssets } from "../api/assets";
import { checkUserByClub } from "../api/user";
import { useConnectWallet } from "@web3-onboard/react";
import { useCallback } from "react";

export default function ProtectRoute(Component) {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [{ wallet }] = useConnectWallet();
    // const [walletAddress, setWalletAddress] = useState(null);

    const [redirect, setRedirect] = useState(false);
    const [networks, setNetworks] = useState([]);
    const [networksFetched, setNetworksFetched] = useState(false);
    const [tokenDecimalUsdc, setTokenDecimalUsdc] = useState(0);

    const USDC_CONTRACT_ADDRESS = useSelector((state) => {
      return state.gnosis.usdcContractAddress;
    });
    const GNOSIS_TRANSACTION_URL = useSelector((state) => {
      return state.gnosis.transactionUrl;
    });

    const walletAddress = Web3.utils.toChecksumAddress(
      wallet?.accounts[0].address,
    );

    if (wallet) {
      localStorage.setItem("wallet", walletAddress);
    }

    const fetchCustomTokenDecimals = useCallback(async () => {
      try {
        if (USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
          const usdcContract = new SmartContract(
            ImplementationContract,
            USDC_CONTRACT_ADDRESS,
            undefined,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
          );

          await usdcContract.obtainTokenDecimals().then((result) => {
            setTokenDecimalUsdc(result);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, [GNOSIS_TRANSACTION_URL, USDC_CONTRACT_ADDRESS]);

    useEffect(() => {
      try {
        if (tokenDecimalUsdc) {
          dispatch(
            setUSDCTokenDetails({
              tokenSymbol: "USDC",
              tokenDecimal: tokenDecimalUsdc,
            }),
          );
        }
      } catch (error) {
        console.log(error);
      }
    }, [dispatch, tokenDecimalUsdc]);

    useEffect(() => {
      fetchCustomTokenDecimals();
    }, [fetchCustomTokenDecimals]);

    const handleRedirectClick = () => {
      // router.push("/");
    };

    const fetchNetworks = () => {
      try {
        const networkData = fetchConfig();
        networkData.then((result) => {
          if (result.status != 200) {
            setNetworksFetched(false);
          } else {
            setNetworks(result.data);
            setNetworksFetched(true);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleMount = useCallback(async () => {
      // if (wallet !== null) {
      //   // setWalletAddress(wallet[0][0].address);
      //   // setWalletLoaded(true);
      //   const getLoginToken = loginToken(walletAddress);
      //   getLoginToken?.then((response) => {
      //     if (response.status !== 200) {
      //       console.log(response.data.error);
      //       // router.push("/");
      //     } else {
      //       setExpiryTime(response.data.tokens.access.expires);
      //       const expiryTime = getExpiryTime();
      //       const currentDate = Date();
      //       setJwtToken(response.data.tokens.access.token);
      //       setRefreshToken(response.data.tokens.refresh.token);
      //       if (expiryTime < currentDate) {
      //         const obtainNewToken = refreshToken(
      //           getRefreshToken(),
      //           getJwtToken(),
      //         );
      //         obtainNewToken
      //           .then((tokenResponse) => {
      //             if (response.status !== 200) {
      //               console.log(tokenResponse.data.error);
      //             } else {
      //               setExpiryTime(tokenResponse.data.tokens.access.expires);
      //               setJwtToken(tokenResponse.data.tokens.access.token);
      //               setRefreshToken(tokenResponse.data.tokens.refresh.token);
      //             }
      //           })
      //           .catch((error) => {
      //             console.log(error);
      //           });
      //       }
      //     }
      //   });
      // }
      if (!wallet) {
        setRedirect(true);
      }
      if (redirect) {
        // router.push("/");
        setRedirect(false);
      }
    }, [redirect, wallet]);

    useEffect(() => {
      handleMount();
    }, [handleMount]);

    useEffect(() => {
      fetchNetworks();
    }, []);

    useEffect(() => {
      try {
        if (networksFetched) {
          const networksAvailable = [];
          networks.forEach((network) => {
            networksAvailable.push(network.networkId);
          });
          const web3 = new Web3(Web3.givenProvider);
          web3.eth.net
            .getId()
            .then((networkId) => {
              if (!networksAvailable.includes(networkId)) {
                setOpen(true);
              }
              updateDynamicAddress(networkId, dispatch);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    }, [networksFetched, networks, dispatch]);

    return wallet ? (
      <Component wallet={walletAddress} />
    ) : (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={redirect}
      >
        <Button onClick={handleRedirectClick}>Home</Button>
      </Backdrop>
    );
  };
  return AuthenticatedComponent;
}

export function getJwtToken() {
  return sessionStorage.getItem("jwt");
}

export function setJwtToken(token) {
  sessionStorage.setItem("jwt", token);
}

export function getExpiryTime() {
  return sessionStorage.getItem("expiresAt");
}

export function setExpiryTime(time) {
  sessionStorage.setItem("expiresAt", time);
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}

export function setRefreshToken(token) {
  sessionStorage.setItem("refreshToken", token);
}

export function authenticateUser(
  clubId,
  walletAddress,
  daoAddress,
  USDC_CONTRACT_ADDRESS,
  GNOSIS_TRANSACTION_URL,
) {
  try {
    if (
      clubId &&
      walletAddress &&
      daoAddress &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL
    ) {
      const factoryContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      const response = factoryContract.userDetails();
      response.then((result) => {
        if (result[0]) {
          // is admin
          return true;
        } else {
          // is not an admin
          return false;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

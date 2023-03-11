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
    const walletAddress = wallet?.accounts[0].address;
    console.log("walllleettttt", wallet);
    const fetchCustomTokenDecimals = async () => {
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
    };

    useEffect(() => {
      if (tokenDecimalUsdc) {
        dispatch(
          setUSDCTokenDetails({
            tokenSymbol: "USDC",
            tokenDecimal: tokenDecimalUsdc,
          }),
        );
      }
    }, [tokenDecimalUsdc]);

    useEffect(() => {
      fetchCustomTokenDecimals();
    }, [USDC_CONTRACT_ADDRESS]);

    const handleRedirectClick = () => {
      // router.push("/");
    };

    const fetchNetworks = () => {
      const networkData = fetchConfig();
      networkData.then((result) => {
        if (result.status != 200) {
          setNetworksFetched(false);
        } else {
          setNetworks(result.data);
          setNetworksFetched(true);
        }
      });
    };

    useEffect(() => {
      fetchNetworks();
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
      // const switched = checkNetwork()

      const handleMount = async () => {
        console.log("wallet in handle mount", wallet);
        if (wallet !== null) {
          // setWalletAddress(wallet[0][0].address);
          setWalletLoaded(true);
          const getLoginToken = loginToken(walletAddress);
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
                      setExpiryTime(tokenResponse.data.tokens.access.expires);
                      setJwtToken(tokenResponse.data.tokens.access.token);
                      setRefreshToken(tokenResponse.data.tokens.refresh.token);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }
          });
        }
        if (wallet === null && !walletLoaded) {
          setRedirect(true);
        }
        if (redirect) {
          // router.push("/");
          setRedirect(false);
        }
      };
      handleMount();
    }, [dispatch, networks, networksFetched, redirect, wallet, walletAddress]);

    return walletLoaded ? (
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
  if (
    clubId &&
    walletAddress &&
    daoAddress &&
    USDC_CONTRACT_ADDRESS &&
    GNOSIS_TRANSACTION_URL
  ) {
    const checkUserInClub = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    const response = checkUserInClub.userDetails();
    response.then((result) => {
      console.log("userdetail", result);
      if (result[0]) {
        // is admin
        return true;
      } else {
        // is not an admin
        return false;
      }
    });
    // check club token type
    // const tokens = getAssets(clubId);
    // tokens.then((tokenResult) => {
    //   if (tokenResult.status != 200) {
    //     return false;
    //   } else {
    //     if (
    //       tokenResult.data.tokenPriceList.length != 0 &&
    //       tokenResult.data.tokenPriceList[0].name === "USDC"
    //     ) {
    //       // check if user is part of a club
    //       // if yes? check whether user holds governance token in the wallet
    //       const checkUser = checkUserByClub(walletAddress, clubId);
    //       console.log("CHECKUSER", checkUser);
    //       checkUser.then(async (user) => {
    //         if (user.data) {
    //           // if user is a part of the club,
    //           // check whether the user wallet holds the governance token
    //           // const usdc_contract = new SmartContract(
    //           //   ImplementationContract,
    //           //   USDC_CONTRACT_ADDRESS,
    //           //   undefined,
    //           //   USDC_CONTRACT_ADDRESS,
    //           //   GNOSIS_TRANSACTION_URL,
    //           // );
    //           // await usdc_contract.balanceOf().then(
    //           //   (result) => {
    //           //     if (result <= 0) {
    //           //       return false;
    //           //     } else {
    //           //       return true;
    //           //     }
    //           //   },
    //           //   (error) => {
    //           //     return false;
    //           //   },
    //           // );
    //         } else {
    //           // if user not part of club
    //           // Check user is an admin?
    //           const checkUserInClub = new SmartContract(
    //             ImplementationContract,
    //             daoAddress,
    //             undefined,
    //             USDC_CONTRACT_ADDRESS,
    //             GNOSIS_TRANSACTION_URL,
    //           );
    //           const response = checkUserInClub.userDetails();
    //           response.then((result) => {
    //             console.log("userdetail", result);
    //             if (result[2]) {
    //               // is admin
    //               return true;
    //             } else {
    //               // is not an admin
    //               return false;
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
  }
}

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Backdrop, Button } from "@mui/material";
import { fetchConfig } from "../api/config";
import { updateDynamicAddress } from "../api";
import Web3 from "web3";
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

    const walletAddress = Web3.utils.toChecksumAddress(
      wallet?.accounts[0].address,
    );

    if (wallet) {
      localStorage.setItem("wallet", walletAddress);
    }

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
        open={redirect}>
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

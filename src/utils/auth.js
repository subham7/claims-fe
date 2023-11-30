import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { fetchConfig } from "../api/config";
import Web3 from "web3";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import BackdropLoader from "@components/common/BackdropLoader";

export default function ProtectRoute(Component) {
  const AuthenticatedComponent = () => {
    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState(false);
    const [networks, setNetworks] = useState([]);
    const [networksFetched, setNetworksFetched] = useState(false);

    const { address: walletAddress } = useAccount();

    if (walletAddress) {
      localStorage.setItem("wallet", walletAddress);
    }

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
      if (!walletAddress) {
        setRedirect(true);
      }
      if (redirect) {
        setRedirect(false);
      }
    }, [redirect, walletAddress]);

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
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    }, [networksFetched, networks, dispatch]);

    return walletAddress ? (
      <Component wallet={walletAddress} />
    ) : (
      <BackdropLoader isOpen={redirect}>
        <Button>Home</Button>
      </BackdropLoader>
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

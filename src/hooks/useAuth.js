/* eslint-disable react-hooks/exhaustive-deps */
import { authToken } from "api/auth";
import { useEffect, useState, useRef, useCallback } from "react";
import { getPublicClient } from "utils/viemConfig";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

const useAuth = () => {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const publicClient = getPublicClient("0x89");
  const [sessionToken, setSessionToken] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const debounceTimeout = useRef(null);

  // Check if sessionToken exists in local storage
  const getTokenFromSession = () => {
    const sessionToken = localStorage.getItem("stationx_sessionToken");
    const sessionExpiry = localStorage.getItem("stationx_sessionExpiry");

    if (
      sessionToken &&
      sessionExpiry &&
      Date.now() < parseInt(sessionExpiry, 10)
    ) {
      return sessionToken;
    }

    localStorage.removeItem("stationx_sessionToken");
    localStorage.removeItem("stationx_sessionExpiry");
    localStorage.removeItem("stationx_signature");
    return null;
  };

  // Verify the signature
  const verifySignature = async (signature) => {
    const valid = await publicClient.verifyMessage({
      address: address,
      message: "Login to StationX",
      signature,
    });
    return valid;
  };

  // Sign the message and store bearer token in local storage with 60 mins expiry
  // If user rejects request || !authToken || error then it disconnects the user
  const signMessage = async () => {
    try {
      setIsChecking(true); // Prevent multiple sign requests

      const signature = await signMessageAsync({
        account: address,
        message: "Login to StationX",
      });

      if (signature) {
        localStorage.setItem("stationx_signature", signature);
        const response = await authToken({
          user: address,
          signature: signature,
        });

        if (response) {
          localStorage.setItem("stationx_sessionToken", response.accessToken);
          localStorage.setItem(
            "stationx_sessionExpiry",
            (Date.now() + 60 * 60 * 1000).toString(),
          );
          setSessionToken(response.accessToken);
        } else {
          disconnect();
        }
      } else {
        disconnect();
      }
    } catch (error) {
      console.log(error);
      disconnect();
    } finally {
      setIsChecking(false);
    }
  };

  const debouncedSignMessage = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      signMessage();
    }, 1000);
  }, [address]);

  const checkSession = useCallback(async () => {
    const token = getTokenFromSession();
    const signature = localStorage.getItem("stationx_signature");

    if (isConnected) {
      if (token && (await verifySignature(signature))) {
        setSessionToken(token);
      } else if (!isChecking) {
        debouncedSignMessage();
      }
    }
  }, [isConnected, address, isChecking, debouncedSignMessage]);

  useEffect(() => {
    checkSession();
  }, [isConnected, address, checkSession]);

  useEffect(() => {
    checkSession();
  }, []);

  return sessionToken;
};

export default useAuth;

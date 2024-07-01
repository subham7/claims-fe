/* eslint-disable react-hooks/exhaustive-deps */
import { authToken } from "api/auth";
import { useEffect, useState } from "react";
import { getPublicClient } from "utils/viemConfig";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

const useAuth = () => {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const publicClient = getPublicClient("0x89");
  const [sessionToken, setSessionToken] = useState(null);

  // Check if sessionToken exists in session storage
  const getTokenFromSession = () => {
    const sessionToken = sessionStorage.getItem("stationx_sessionToken");
    if (sessionToken) {
      const sessionExpiry = sessionStorage.getItem("stationx_sessionExpiry");
      if (Date.now() < sessionExpiry) {
        return sessionToken;
      } else {
        sessionStorage.removeItem("stationx_sessionToken");
        sessionStorage.removeItem("stationx_sessionExpiry");
      }
    }
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

  // Sign the message and store bearer token in session storage with 60 mins expiry
  // If user rejects request || !authToken || error then it disconnects the user
  const signMessage = async () => {
    try {
      const signature = await signMessageAsync({
        account: address,
        message: "Login to StationX",
      });
      if (signature) {
        sessionStorage.setItem("stationx_signature", signature);
        const response = await authToken({
          user: address,
          signature: signature,
        });
        if (response) {
          sessionStorage.setItem("stationx_sessionToken", response.accessToken);
          sessionStorage.setItem(
            "stationx_sessionExpiry",
            Date.now() + 60 * 60 * 1000,
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
    }
  };

  useEffect(() => {
    if (isConnected) {
      const token = getTokenFromSession();
      const signature = sessionStorage.getItem("stationx_signature");
      if (token && verifySignature(signature)) {
        setSessionToken(token);
      } else {
        signMessage();
      }
    }
  }, [isConnected, address]);

  return sessionToken;
};

export default useAuth;

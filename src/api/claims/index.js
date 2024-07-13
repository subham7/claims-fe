import { MAIN_API_URL } from "..";

export const createClaimCsv = async (jsonData, networkId) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}snapshot/create/csv?networkId=${networkId}`,
      {
        method: "POST",
        body: jsonData,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCsvUserData = async (merkleRoot) => {
  try {
    const res = await fetch(`${MAIN_API_URL}snapshot/${merkleRoot}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createSnapShot = async (
  totalClaimAmount,
  airdropTokenAddress,
  tokenGatingAddress,
  tokenGatingNetwork,
  blockNumber,
  networkId,
) => {
  try {
    const res = await fetch(`${MAIN_API_URL}snapshot/create`, {
      method: "POST",
      body: JSON.stringify({
        totalClaimAmount: totalClaimAmount,
        airdropTokenAddress,
        gatingTokenAddress: tokenGatingAddress,
        gatingTokenNetwork: tokenGatingNetwork,
        blockNumber,
        networkId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserProofAndBalance = async (merkleRoot, userAddress) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}snapshot/user/${userAddress}?merkleRoot=${merkleRoot}`,
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createClaimDetails = async ({
  claimAddress,
  description,
  socialLinks,
  imageLinks,
  networkId,
  tweetText,
}) => {
  try {
    const res = await fetch(`${MAIN_API_URL}claim`, {
      method: "POST",
      body: JSON.stringify({
        claimAddress,
        description,
        socialLinks,
        imageLinks,
        networkId,
        tweetText,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getClaimDetails = async (claimAddress) => {
  try {
    const res = await fetch(`${MAIN_API_URL}claim/${claimAddress}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

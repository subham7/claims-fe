import { MAIN_API_URL } from "..";

export const createClaimCsv = async (jsonData) => {
  try {
    const res = await fetch(`${MAIN_API_URL}snapshot/create/csv`, {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getClaimsByUserAddress = async (userAddress, networkId) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}claim/user/${userAddress}?networkId=${networkId}`,
    );
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
        totalClaimAmount: Number(totalClaimAmount) * 10 ** 18,
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

// export const sendMerkleTree = async (jsonData) => {
//   try {
//     const res = await fetch(`${MAIN_API_URL}snapshot/create`, {
//       method: "POST",
//       body: jsonData,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// };

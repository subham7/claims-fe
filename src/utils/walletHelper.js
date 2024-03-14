export const addTokenToWallet = async (
  tokenAddress,
  tokenSymbol,
  tokenImage,
  tokenId,
) => {
  try {
    const wasAdded = isNaN(Number(tokenId))
      ? await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: 18,
              image: tokenImage ?? "",
            },
          },
        })
      : await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: tokenAddress,
              tokenId,
            },
          },
        });

    if (wasAdded) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

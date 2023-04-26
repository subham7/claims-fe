export const QUERY_ALL_MEMBERS = (daoAddress) => {
  return `query{
        users(where: {daoAddress :"${daoAddress}"}){
            id
            gtAmount
            depositAmount
            isAdmin
            timeStamp
            userAddress
            tokenAddress
            daoAddress
        }
    }`;
};

export const QUERY_CLUBS_FROM_WALLET_ADDRESS = (userAddress) => {
  return `query{
        users(where: {userAddress: "${userAddress}"}){
            id
            daoAddress
            daoName
            userAddress
            isAdmin
            tokenAddress
            timeStamp
            gtAmount
            depositAmount
        }
    }`;
};

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

export const QUERY_PAGINATED_MEMBERS = (
  daoAddress,
  first,
  skip,
  startDate,
  endDate,
) => {
  return `query{
    users(
      where: {
        daoAddress: "${daoAddress}",
        timeStamp_gte: ${startDate},
        timeStamp_lte: ${endDate}
      },
      first: ${first},
      skip: ${skip}
    ) {
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
        users(  orderBy: timeStamp where: {userAddress: "${userAddress}"}){
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

export const QUERY_CLUB_DETAILS = (daoAddress) => {
  return `query{
            stations(where: {daoAddress: "${daoAddress}"}) {
              id
              ownerAddress
              daoAddress
              gnosisAddress
              name
              tokenType
              symbol
              isGtTransferable
              imageUrl
              isGovernanceActive
              membersCount
            }
    }`;
};

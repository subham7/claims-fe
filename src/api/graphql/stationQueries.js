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

export const QUERY_LATEST_MEMBERS = (daoAddress) => {
  return `query{
        users(
          where: {daoAddress: "${daoAddress}"}
          first: 5
          orderBy: timeStamp
          orderDirection: desc
        ) {
          userAddress
          timeStamp
        }
    }`;
};

export const QUERY_PAGINATED_MEMBERS = (daoAddress, first, skip) => {
  return `query{
      users(
        where: {
          daoAddress: "${daoAddress}",
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

export const QUERY_STATIONS_LIST = (userAddress) => {
  return `query{
          users(  
            orderBy: timeStamp           
            orderDirection: desc 
            where: {userAddress: "${userAddress}"}){
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

export const QUERY_STATION_DETAILS = (daoAddress) => {
  return `query{
              stations(where: {daoAddress: "${daoAddress}"}) {
                id
                ownerAddress
                daoAddress
                gnosisAddress
                totalAmountRaised
                tokenType
                timeStamp
                threshold
                symbol
                raiseAmount
                quorum
                pricePerToken
                name
                membersCount
                isGtTransferable
                isGovernanceActive
                imageUrl
                distributionAmount
                maxDepositAmount
                minDepositAmount
                maxTokensPerUser
                depositDeadline
              }
      }`;
};

export const IS_STATION_MEMBER = (address, daoAddress) => {
  return `query{
    users(
    where: {daoAddress: "${daoAddress}", userAddress: "${address}"}
  ) {
    daoAddress
    daoName
    depositAmount
    gtAmount
    id
    isAdmin
    timeStamp
    tokenAddress
    userAddress
  }
  }`;
};

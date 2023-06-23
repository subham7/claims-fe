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
            }
    }`;
};

export const QUERY_ALL_CLAIMS_TRANSACTIONS = (claimAddress) => {
  return `query{
            airdrops(where: {claimAddress: "${claimAddress}"}, orderBy: timestamp) {
              id
              txHash
              claimAddress
              claimerAddress
              airdropToken
              amountClaimed
              totalAmountClaimed
              timestamp
            }
    }`;
};

export const QUERY_WALLET_WISE_TRANSACTIONS = (claimAddress) => {
  return `query{
            claimers(where: {claimAddress: "${claimAddress}"}) {
              claimAddress
              claimerAddress
              totalAmountClaimed
              id
            }
    }`;
};

export const QUERY_ALL_CLAIMS_OF_CREATOR = (creatorAddress) => {
  return `query{
            claims(where: {creatorAddress: "${creatorAddress}"}) {
              id
              txHash
              claimAddress
              creatorAddress
              coolDownTime
              airdropToken
              admins
              description
              endTime
              hasAllowanceMechanism
              maxClaimableAmount
              merkleRoot
              minWhitelistTokenValue
              moderators
              numOfUsersClaimed
              startTime
              tokenDistributionWallet
              totalAmountClaimed
              totalClaimAmount
              totalUsers
              whitelistToken
              claimType
              timestamp
            }
    }`;
};

export const QUERY_CLAIM_DETAILS = (claimAddress) => {
  return `query{
            claims(where: {claimAddress: "${claimAddress}"}) {
              id
              txHash
              claimAddress
              creatorAddress
              coolDownTime
              airdropToken
              admins
              description
              endTime
              hasAllowanceMechanism
              maxClaimableAmount
              merkleRoot
              minWhitelistTokenValue
              moderators
              numOfUsersClaimed
              startTime
              tokenDistributionWallet
              totalAmountClaimed
              totalClaimAmount
              totalUsers
              whitelistToken
              claimType
              timestamp
            }
    }`;
};

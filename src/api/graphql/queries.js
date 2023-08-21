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
      ) {
        userAddress
        timeStamp
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
            claims(where: {creatorAddress: "${creatorAddress}"}, orderBy: timestamp) {
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
              isActive
              networkId
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
              isActive
              networkId
            }
    }`;
};

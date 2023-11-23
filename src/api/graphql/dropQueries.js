export const QUERY_ALL_DROPS_TRANSACTIONS = (claimAddress) => {
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

export const QUERY_LATEST_TEN_DROPS_TRANSACTIONS = (claimAddress) => {
  return `query{
              airdrops(where: {claimAddress: "${claimAddress}"}, first: 10 ) {
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

export const QUERY_WALLET_CLAIM_TRANSACTIONS = (claimAddress) => {
  return `query{
              claimers(where: {claimAddress: "${claimAddress}"}) {
                claimAddress
                claimerAddress
                totalAmountClaimed
                id
              }
      }`;
};

export const QUERY_WALLET_DROPS = (creatorAddress) => {
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
                whitelistTokenNetwork
                whitelistTokenBlockNum
              }
      }`;
};

export const QUERY_DROP_DETAILS = (claimAddress) => {
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
                whitelistTokenNetwork
                whitelistTokenBlockNum
              }
      }`;
};

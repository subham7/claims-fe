import { gql } from "@apollo/client";

export const fetchProfileFollowers = gql`
  query fetchProfileFollowers($profileId: ProfileId!) {
    followers(request: { profileId: $profileId }) {
      items {
        wallet {
          address
        }
      }
    }
  }
`;

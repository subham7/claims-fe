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

export const fetchProfileByHandle = gql`
  query fetchProfileByHandle($handle: Handle!) {
    profile(request: { handle: $handle }) {
      id
      name
    }
  }
`;

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

export const fetchCommentsProfileByPost = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          profile {
            name
            ownedBy
          }
        }
      }
    }
  }
`;

export const fetchMirrorsProfileByPost = gql`
  query Profiles($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
        isDefault
        isFollowedByMe
        __typename
      }
      pageInfo {
        next
        __typename
      }
      __typename
    }
  }

  fragment ProfileFields on Profile {
    name
    ownedBy
    __typename
  }
`;

export const fetchHandleByAddress = gql`
  query Profiles($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        handle
        ownedBy
      }
    }
  }
`;

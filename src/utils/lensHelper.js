import { extractPartFromUrl } from "./helper";

const {
  fetchProfileByHandle,
  fetchProfileFollowers,
  fetchCommentsProfileByPost,
} = require("api/lens");
const { apolloClient } = require("../../pages/_app");

export const handleFetchFollowers = async (profileId) => {
  try {
    const profile = await apolloClient.query({
      query: fetchProfileByHandle,
      variables: { handle: profileId },
    });

    if (profile?.data?.profile === null) {
      throw new Error("No profile found");
    }

    const { data } = await apolloClient.query({
      query: fetchProfileFollowers,
      variables: { profileId: profile?.data?.profile?.id },
    });

    let followersAddressArray = [];
    data?.followers?.items.map((follower) => {
      followersAddressArray.push(follower.wallet.address);
    });

    if (followersAddressArray === undefined || !followersAddressArray.length) {
      throw new Error("No followers found");
    }

    return followersAddressArray;
  } catch (error) {
    throw new Error(error);
  }
};

export const handleFetchCommentAddresses = async (postLink) => {
  try {
    const postId = extractPartFromUrl(postLink);

    const { data } = await apolloClient.query({
      query: fetchCommentsProfileByPost,
      variables: {
        request: {
          commentsOf: postId,
        },
      },
    });

    if (!data?.publications?.items.length) {
      throw new Error("No comments found!");
    }

    let userArray = [];
    data?.publications?.items.map((user) => {
      userArray.push(user?.profile?.ownedBy);
    });

    if (userArray === undefined || !userArray.length) {
      throw new Error("No Comments found");
    }

    return userArray;
  } catch (error) {
    throw new Error(error);
  }
};

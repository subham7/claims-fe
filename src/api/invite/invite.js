import axios from "axios";

const REFERRAL_ROOT_URL = "https://cjjbrk3fq7.us-east-1.awsapprunner.com/v1/";

const DEFAULT_CODE = "UECVXT";

export const whitelistUser = async ({ address, referralCode }) => {
  try {
    const response = await axios.post(REFERRAL_ROOT_URL + "referral-code ", {
      userAddress: address,
      referralCode,
    });

    return response?.data?.referralCode ?? false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getReferralCode = async (adddress) => {
  try {
    const response = await axios.get(
      REFERRAL_ROOT_URL + `referral-code/user/${adddress}`,
    );

    return response?.data?.referralCode ? response.data.referralCode : false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const whitelistOnDeposit = async (address) => {
  try {
    const response = await getReferralCode(address);
    if (response) {
    } else {
      whitelistUser({ address, referralCode: DEFAULT_CODE });
    }
  } catch (e) {
    console.error(e);
  }
};

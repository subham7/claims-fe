import axios from "axios";

export const getAnalyticsOfStationX = async () => {
  try {
    return await axios.get(
      `https://p9ixcq2upr.us-east-1.awsapprunner.com/v1/analytics`,
    );
  } catch (error) {
    console.log(error);
  }
};

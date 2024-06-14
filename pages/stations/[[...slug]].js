import { useEffect, useState } from "react";
import Layout from "@components/layouts/layout";
import Stations from "@components/stationsPageComps/Stations";
import { getReferralCode } from "api/invite/invite";
import BackdropLoader from "@components/common/BackdropLoader";
import { queryStationListFromSubgraph } from "utils/stationsSubgraphHelper";
import { useAccount } from "wagmi";

const StationsPage = () => {
  const { address: walletAddress } = useAccount();
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clubListData, setClubListData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (walletAddress) {
          const code = await getReferralCode(walletAddress);
          if (code) {
            setIsUserWhitelisted(true);
          } else {
            setIsUserWhitelisted(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [walletAddress]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const stations = await queryStationListFromSubgraph(walletAddress);

        if (stations?.data?.clubs) setClubListData(stations.data.clubs);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress) fetchClubs();
  }, [walletAddress]);

  if (isUserWhitelisted === null || isLoading) {
    return (
      <Layout showSidebar={false} faucet={false}>
        <BackdropLoader isOpen={true} showLoading={true} />
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false} faucet={false}>
      <Stations clubListData={clubListData} />
    </Layout>
  );
};

export default StationsPage;

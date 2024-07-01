import { useState, useEffect } from "react";
import { queryStationListFromSubgraph } from "utils/stationsSubgraphHelper";

const useAllClubsFetch = (walletAddress) => {
  const [clubListData, setClubListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const stations = await queryStationListFromSubgraph(walletAddress);

        if (stations?.data?.clubs) setClubListData(stations.data.clubs);

        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (walletAddress) {
      fetchClubs();
    }
  }, [walletAddress]);

  return { clubListData, isLoading, error };
};

export default useAllClubsFetch;

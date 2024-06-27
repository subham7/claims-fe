import { getClubsData } from "api/club";
import { useState, useEffect } from "react";

const useStationFetch = (daoAddress) => {
  const [stationData, setStationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const data = await getClubsData(daoAddress);
        setStationData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (daoAddress) {
      fetchStation();
    }
  }, [daoAddress]);

  return { stationData, isLoading, error };
};

export default useStationFetch;

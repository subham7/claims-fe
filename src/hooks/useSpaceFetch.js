import { getSpace } from "api/space";
import { useState, useEffect } from "react";

const useSpaceFetch = (spaceId) => {
  const [spaceData, setSpaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await getSpace(spaceId);
        setSpaceData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  return { spaceData, isLoading, error };
};

export default useSpaceFetch;

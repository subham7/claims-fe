import React, { useEffect, useState } from "react";
import { getDefaultProfile } from "utils/lensHelper";

const LensHandleComponent = ({ address }) => {
  const [lensHandle, setLensHandle] = useState("");

  const fetchLensUserHandle = async (address) => {
    if (address) {
      const lensHandle = await getDefaultProfile(address);
      if (lensHandle) {
        return lensHandle;
      } else return "";
    }
  };

  const fetchAndSetLensHandle = (address) => {
    if (address) {
      fetchLensUserHandle(address)
        .then((lensHandle) => {
          if (lensHandle) {
            setLensHandle(lensHandle);
          } else {
            setLensHandle("");
          }
        })
        .catch((error) => {
          console.error("Error fetching lens handle:", error);
        });
    }
  };

  useEffect(() => {
    fetchAndSetLensHandle(address);
  }, [address]);
  return (
    <div>
      <p>Lens Handle: {lensHandle}</p>
    </div>
  );
};

export default LensHandleComponent;

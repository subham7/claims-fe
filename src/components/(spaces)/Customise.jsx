/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import classes from "./Spaces.module.scss";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { getSpace, updateSpace } from "api/space";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import Tabs from "./Customise/Tabs";
import Basic from "./Customise/Basic";
import Social from "./Customise/Social";
import Stations from "./Customise/Stations";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import AddStationsModal from "@components/modals/AddStationsSpaceModal/AddStationsModal";
import useAllClubsFetch from "hooks/useAllClubsFetch";
import useStationFetch from "hooks/useStationFetch";
import useAuth from "hooks/useAuth";
import {
  addManagers,
  addSelectedStations,
  addSpaceBasicData,
  addSpaceSocialData,
} from "redux/reducers/space";

const Customise = ({ spaceId }) => {
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
  const authToken = useAuth();
  const spaceBasicData = useSelector((state) => {
    return state.space.spaceBasicData;
  });
  const spaceSocialData = useSelector((state) => {
    return state.space.spaceSocialData;
  });
  const managers = useSelector((state) => {
    return state.space.managers;
  });
  const selectedStations = useSelector((state) => {
    return state.space.selectedStations;
  });
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showAddStationsModal, setShowAddStationsModal] = useState(false);
  const { address } = useAccount();
  const dispatch = useDispatch();
  const router = useRouter();
  const [id] = router?.query?.slug ?? [];
  const { clubListData, isLoading: isClubLoading } = useAllClubsFetch(address);
  const { stationData } = useStationFetch(JSON.stringify(selectedStations));
  const [isFixed, setIsFixed] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const initialDataRef = useRef();

  const formatURL = (url, path) => {
    if (url.startsWith(path)) {
      return url.slice(path.length);
    }
    return "";
  };

  const handleUpdateSpace = async () => {
    if (address) {
      const spaceData = {
        name: spaceBasicData.name,
        description: spaceBasicData.description,
        logo: spaceBasicData.logo,
        coverPic: spaceBasicData.coverPic,
        creator: address,
        managers: managers,
        stations: selectedStations,
        isPrivate: false,
        isActive: true,
        allowlistId: "",
        tokenGating: {
          isActive: true,
          operator: "and",
          tokens: [
            {
              address: "",
              quantity: 1,
            },
          ],
        },
        links: {
          warpcast: spaceSocialData.warpcast
            ? `https://warpcast.com/${spaceSocialData.warpcast}`
            : "",
          twitter: spaceSocialData.twitter
            ? `https://twitter.com/${spaceSocialData.twitter}`
            : "",
          telegram: spaceSocialData.telegram
            ? `https://t.me/${spaceSocialData.telegram}`
            : "",
          website: spaceSocialData.website
            ? `https://${spaceSocialData.website}`
            : "",
          discord: spaceSocialData.discord
            ? `https://discord.com/${spaceSocialData.discord}`
            : "",
          instagram: spaceSocialData.instagram
            ? `https://instagram.com/${spaceSocialData.instagram}`
            : "",
          reddit: spaceSocialData.reddit
            ? `https://reddit.com/${spaceSocialData.reddit}`
            : "",
        },
      };
      const response = await updateSpace(spaceId, spaceData, authToken);
      dispatch(
        setAlertData(
          generateAlertData("Space updated successfully!", "success"),
        ),
      );
      setIsSaveLoading(false);
      router.push(`/space/${spaceId}`);
    } else {
      setIsSaveLoading(false);
      dispatch(
        setAlertData(
          generateAlertData(
            "Only creator is allowed to customise it.",
            "error",
          ),
        ),
      );
    }
  };

  const checkForChanges = () => {
    const initialData = initialDataRef.current;
    if (!initialData) return;
    const currentData = {
      spaceBasicData,
      spaceSocialData,
      managers,
      selectedStations,
    };

    setHasChanges(JSON.stringify(initialData) !== JSON.stringify(currentData));
  };

  useEffect(() => {
    checkForChanges();
  }, [spaceBasicData, spaceSocialData, managers, selectedStations]);

  useEffect(() => {
    if (address) {
      if (spaceData) {
        if (address !== spaceData.creator) {
          router.push(`/space/${id}`);
        }
      }
    } else {
      if (id) router.push(`/space/${id}`);
    }
  }, [spaceData, address, id]);

  useEffect(() => {
    if (spaceData) {
      const initialData = {
        spaceBasicData: {
          name: spaceData?.name,
          description: spaceData?.description,
          logo: spaceData?.logo,
          coverPic: spaceData?.coverPic,
        },
        spaceSocialData: {
          warpcast: formatURL(
            spaceData?.links?.warpcast,
            "https://warpcast.com/",
          ),
          twitter: formatURL(spaceData?.links?.twitter, "https://twitter.com/"),
          telegram: formatURL(spaceData?.links?.telegram, "https://t.me/"),
          website: formatURL(spaceData?.links?.website, "https://"),
          discord: formatURL(spaceData?.links?.discord, "https://discord.com/"),
          instagram: formatURL(
            spaceData?.links?.instagram,
            "https://instagram.com/",
          ),
          reddit: formatURL(spaceData?.links?.reddit, "https://reddit.com/"),
        },
        managers: spaceData?.managers,
        selectedStations: spaceData?.stations,
      };

      initialDataRef.current = initialData;

      dispatch(addSpaceBasicData(initialData.spaceBasicData));
      dispatch(addSpaceSocialData(initialData.spaceSocialData));
      dispatch(addManagers(initialData.managers));
      dispatch(addSelectedStations(initialData.selectedStations));
    }
  }, [spaceData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPosition = window.innerWidth < 768 ? 1400 : 1200;

      if (scrollPosition > triggerPosition) {
        setIsFixed(false);
      } else {
        setIsFixed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchSpace = async () => {
      const response = await getSpace(spaceId);
      if (!response) {
        router.push("/");
      }
      setIsValidating(false);
    };
    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  if (isLoading || isValidating) {
    return <BackdropLoader isOpen={true} showLoading={true} />;
  }

  return (
    <div className={classes.spaceCustomise}>
      <button
        className={classes.backButton}
        onClick={() => {
          router.push(`/space/${spaceId}`);
        }}>
        <FaArrowLeft className={classes.arrow} /> Back
      </button>
      <h1 className={classes.header}>Customise</h1>
      <Tabs />
      <Basic />
      <Social />
      <Stations
        setShowAddStationsModal={setShowAddStationsModal}
        stationData={stationData}
      />
      <div
        className={isFixed ? classes.fixedSaveButton : classes.staticSaveButton}
        style={{
          display: "flex",
          justifyContent: "end",
        }}>
        <button
          className={classes.button}
          onClick={() => {
            setIsSaveLoading(true);
            handleUpdateSpace();
          }}
          disabled={isSaveLoading || !hasChanges}>
          {isSaveLoading ? "Saving..." : "Save"}
        </button>
      </div>
      {showAddStationsModal && (
        <AddStationsModal
          setShowAddStationsModal={setShowAddStationsModal}
          clubs={clubListData}
          isLoading={isClubLoading}
        />
      )}
    </div>
  );
};

export default Customise;

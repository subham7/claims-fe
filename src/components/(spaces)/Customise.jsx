/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import classes from "./Spaces.module.scss";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { updateSpace } from "api/space";
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

const Customise = ({ spaceId }) => {
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
  const authToken = useAuth();
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [farcaster, setFarcaster] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [reddit, setReddit] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [managers, setManagers] = useState([]);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [showAddStationsModal, setShowAddStationsModal] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);
  const { address } = useAccount();
  const dispatch = useDispatch();
  const router = useRouter();
  const [id] = router?.query?.slug ?? [];
  const { clubListData, isLoading: isClubLoading } = useAllClubsFetch(address);
  const { stationData } = useStationFetch(JSON.stringify(selectedStations));

  const formatURL = (url, path) => {
    if (url.startsWith(path)) {
      return url.slice(path.length);
    }
    return "";
  };

  const handleUpdateSpace = async () => {
    if (address) {
      const spaceData = {
        name: spaceName,
        description: description,
        logo: logo,
        coverPic: coverPic,
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
          warpcast: farcaster ? `https://warpcast.com/${farcaster}` : "",
          twitter: twitter ? `https://twitter.com/${twitter}` : "",
          telegram: telegram ? `https://t.me/${telegram}` : "",
          website: website ? `https://${website}` : "",
          discord: discord ? `https://discord.com/${discord}` : "",
          instagram: instagram ? `https://instagram.com/${instagram}` : "",
          reddit: reddit ? `https://reddit.com/${reddit}` : "",
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
      setSpaceName(spaceData?.name);
      setDescription(spaceData?.description);
      setLogo(spaceData?.logo);
      setCoverPic(spaceData?.coverPic);
      setManagers(spaceData?.managers);
      setSelectedStations(spaceData?.stations);
      setFarcaster(
        formatURL(spaceData?.links?.warpcast, "https://warpcast.com/"),
      );
      setTelegram(formatURL(spaceData?.links?.telegram, "https://t.me/"));
      setTwitter(formatURL(spaceData?.links?.twitter, "https://twitter.com/"));
      setDiscord(formatURL(spaceData?.links?.discord, "https://discord.com/"));
      setReddit(formatURL(spaceData?.links?.reddit, "https://reddit.com/"));
      setInstagram(
        formatURL(spaceData?.links?.instagram, "https://instagram.com/"),
      );
      setWebsite(formatURL(spaceData?.links?.website, "https://"));
    }
  }, [spaceData]);

  if (isLoading) {
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
      <Basic
        spaceName={spaceName}
        setSpaceName={setSpaceName}
        description={description}
        setDescription={setDescription}
        logo={logo}
        setLogo={setLogo}
        coverPic={coverPic}
        setCoverPic={setCoverPic}
      />
      <Social
        farcaster={farcaster}
        setFarcaster={setFarcaster}
        telegram={telegram}
        setTelegram={setTelegram}
        twitter={twitter}
        setTwitter={setTwitter}
        discord={discord}
        setDiscord={setDiscord}
        reddit={reddit}
        setReddit={setReddit}
        instagram={instagram}
        setInstagram={setInstagram}
        website={website}
        setWebsite={setWebsite}
      />
      <Stations
        selectedStations={selectedStations}
        setSelectedStations={setSelectedStations}
        setShowAddStationsModal={setShowAddStationsModal}
        stationData={stationData}
      />
      <div className={classes.save}>
        <button
          className={classes.button}
          onClick={() => {
            setIsSaveLoading(true);
            handleUpdateSpace();
          }}
          disabled={isSaveLoading}>
          {isSaveLoading ? "Saving..." : "Save"}
        </button>
      </div>
      {showAddStationsModal && (
        <AddStationsModal
          setShowAddStationsModal={setShowAddStationsModal}
          clubs={clubListData}
          isLoading={isClubLoading}
          selectedStations={selectedStations}
          setSelectedStations={setSelectedStations}
        />
      )}
    </div>
  );
};

export default Customise;

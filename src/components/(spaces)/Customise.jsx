/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import classes from "./Spaces.module.scss";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { updateSpace } from "api/space";
import { uploadFileToAWS } from "utils/helper";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";

const Customise = ({ spaceId }) => {
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
  const [activeTab, setActiveTab] = useState(0);
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [farcaster, setFarcaster] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [reddit, setReddit] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const { address } = useAccount();
  const dispatch = useDispatch();

  const formatURL = (url, path) => {
    if (url.startsWith(path)) {
      return url.slice(path.length);
    }
    return "";
  };

  const handleUploadFile = async (file) => {
    const response = await uploadFileToAWS(file);
    setLogo(response);
  };

  const handleUpdateSpace = async () => {
    if (address) {
      const spaceData = {
        name: spaceName,
        description: description,
        logo: logo,
        creator: address,
        managers: [],
        stations: [],
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
          warpcast: `https://warpcast.com/${farcaster}`,
          twitter: `https://twitter.com/${twitter}`,
          telegram: `https://t.me/${telegram}`,
          website: `https://${website}`,
          discord: `https://discord.com/${discord}`,
          instagram: `https://instagram.com/${instagram}`,
          reddit: `https://reddit.com/${reddit}`,
        },
      };
      const response = await updateSpace(spaceId, spaceData);
      dispatch(
        setAlertData(
          generateAlertData("Space updated successfully!", "success"),
        ),
      );
      setIsSaveLoading(false);
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
    if (spaceData) {
      setSpaceName(spaceData?.name);
      setDescription(spaceData?.description);
      setLogo(spaceData?.logo);
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
      <h1 className={classes.header}>Customise</h1>
      <div className={classes.tabs}>
        <button
          className={classes.tab}
          style={{
            borderBottom:
              activeTab === 0 ? "2px solid #fff" : "2px solid transparent",
          }}
          onClick={() => setActiveTab(0)}>
          General
        </button>
        <button
          className={classes.tab}
          onClick={() => setActiveTab(1)}
          style={{
            borderBottom:
              activeTab === 1 ? "2px solid #fff" : "2px solid transparent",
          }}>
          Permissions
        </button>
      </div>
      <div
        className={classes.subHeader}
        style={{
          paddingBottom: "1.2rem",
          borderBottom: "0.5px solid #2e2e2e",
        }}>
        <h1 className={classes.title}>Basic</h1>
        <p className={classes.description}>Some info about your space.</p>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Name</p>
          <p className={classes.description}>Name of your space.</p>
        </div>
        <input
          className={classes.input}
          placeholder="Space name"
          value={spaceName}
          onChange={(event) => setSpaceName(event.target.value)}
        />
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Summary</p>
          <p className={classes.description}>
            A short summary on what your space is about. This is displayed on
            social media shares, and other discovery mediums on StationX.
          </p>
        </div>
        <textarea
          className={classes.input}
          placeholder="Tell more about your space here"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          style={{
            height: "7rem",
          }}
        />
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Logo</p>
          <p className={classes.description}>
            Logo will be displayed on your space.
          </p>
        </div>
        <div className={classes.spaceImage}>
          <img
            src={logo ? logo : "/assets/icons/avatar.png"}
            alt="logo"
            className={classes.logo}
          />
          <button className={classes.uploadButton}>
            <div className={classes.label}>Change</div>
            <input
              id="upload"
              className={classes.input}
              name="upload"
              type="file"
              onChange={(event) => {
                setLogo(URL.createObjectURL(event.target.files[0]));
                handleUploadFile(event.target.files[0]);
              }}
              accept="image/*"
            />
          </button>
        </div>
      </div>
      <div
        className={classes.subHeader}
        style={{
          paddingBottom: "1.2rem",
          borderBottom: "0.5px solid #2e2e2e",
        }}>
        <h1 className={classes.title}>Social Links</h1>
        <p
          className={classes.description}
          style={{
            width: "14rem",
          }}>
          Display your social media links on your space.
        </p>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Farcaster</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>warpcast.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationx"
            value={farcaster}
            onChange={(event) => setFarcaster(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Telegram</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>t.me/</span>
          <input
            className={classes.socialInput}
            placeholder="spaces"
            value={telegram}
            onChange={(event) => setTelegram(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Twitter / X</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>twitter.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationxnetwork"
            value={twitter}
            onChange={(event) => setTwitter(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Discord</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>discord.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationxnetwork"
            value={discord}
            onChange={(event) => setDiscord(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Reddit</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>reddit.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationxnetwork"
            value={reddit}
            onChange={(event) => setReddit(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Instagram</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>instagram.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationxnetwork"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Website</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>https://</span>
          <input
            className={classes.socialInput}
            placeholder="stationx.network"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
      </div>
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
    </div>
  );
};

export default Customise;

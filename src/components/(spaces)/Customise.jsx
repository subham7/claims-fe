/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import classes from "./Spaces.module.scss";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";

const Customise = ({ spaceId }) => {
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
  const [activeTab, setActiveTab] = useState(0);
  const [spaceName, setSpaceName] = useState("");
  const [logo, setLogo] = useState("");

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
          onChange={(e) => setSpaceName(e.target.value)}
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
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
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
              onChange={(e) => {
                const image = URL.createObjectURL(e.target.files[0]);
                setLogo(image);
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
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
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
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
          />
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Twitter / X</p>
        </div>
        <div className={classes.inputPrefix}>
          <span className={classes.prefix}>x.com/</span>
          <input
            className={classes.socialInput}
            placeholder="stationxnetwork"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
          />
        </div>
      </div>
      <div className={classes.save}>
        <button className={classes.button}>Save</button>
      </div>
    </div>
  );
};

export default Customise;

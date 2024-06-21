import classes from "../Spaces.module.scss";

const Social = ({
  farcaster,
  setFarcaster,
  telegram,
  setTelegram,
  twitter,
  setTwitter,
  discord,
  setDiscord,
  reddit,
  setReddit,
  instagram,
  setInstagram,
  website,
  setWebsite,
}) => {
  return (
    <>
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
    </>
  );
};

export default Social;

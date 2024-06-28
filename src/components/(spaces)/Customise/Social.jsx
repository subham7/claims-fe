import { useDispatch, useSelector } from "react-redux";
import classes from "../Spaces.module.scss";
import { addSpaceSocialData } from "redux/reducers/space";

const Social = () => {
  const dispatch = useDispatch();
  const spaceSocialData = useSelector((state) => {
    return state.space.spaceSocialData;
  });
  const socialPlatforms = [
    {
      name: "Farcaster",
      prefix: "warpcast.com/",
      key: "warpcast",
      placeholder: "stationx",
    },
    {
      name: "Telegram",
      prefix: "t.me/",
      key: "telegram",
      placeholder: "spaces",
    },
    {
      name: "Twitter / X",
      prefix: "twitter.com/",
      key: "twitter",
      placeholder: "stationxnetwork",
    },
    {
      name: "Discord",
      prefix: "discord.com/",
      key: "discord",
      placeholder: "stationxnetwork",
    },
    {
      name: "Reddit",
      prefix: "reddit.com/",
      key: "reddit",
      placeholder: "stationxnetwork",
    },
    {
      name: "Instagram",
      prefix: "instagram.com/",
      key: "instagram",
      placeholder: "stationxnetwork",
    },
    {
      name: "Website",
      prefix: "https://",
      key: "website",
      placeholder: "stationx.network",
    },
  ];

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
      {socialPlatforms.map((platform) => (
        <div className={classes.form} key={platform.key}>
          <div className={classes.subHeader}>
            <p>{platform.name}</p>
          </div>
          <div className={classes.inputPrefix}>
            <span className={classes.prefix}>{platform.prefix}</span>
            <input
              className={classes.socialInput}
              placeholder={platform.placeholder}
              value={spaceSocialData[platform.key]}
              onChange={(event) => {
                dispatch(
                  addSpaceSocialData({
                    ...spaceSocialData,
                    [platform.key]: event.target.value,
                  }),
                );
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Social;

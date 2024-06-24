/* eslint-disable @next/next/no-img-element */
import { uploadFileToAWS } from "utils/helper";
import classes from "../Spaces.module.scss";

const Basic = ({
  spaceName,
  setSpaceName,
  description,
  setDescription,
  logo,
  setLogo,
  coverPic,
  setCoverPic,
}) => {
  const handleUploadFile = async (file, attribute) => {
    const response = await uploadFileToAWS(file);
    if (attribute === "logo") {
      setLogo(response);
    } else {
      setCoverPic(response);
    }
  };
  return (
    <>
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
            src={logo ? logo : "/assets/images/spaceLogo.png"}
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
                handleUploadFile(event.target.files[0], "logo");
              }}
              accept="image/*"
            />
          </button>
        </div>
      </div>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <p>Cover Banner</p>
          <p className={classes.description}>
            Add an attractive banner on your space.
          </p>
        </div>
        <div className={classes.spaceImage}>
          <img
            src={coverPic ? coverPic : "/assets/images/spaceBanner.jpg"}
            alt="coverPic"
            className={classes.banner}
          />
          <button className={classes.uploadButton}>
            <div className={classes.label}>Change</div>
            <input
              id="upload"
              className={classes.input}
              name="upload"
              type="file"
              onChange={(event) => {
                setCoverPic(URL.createObjectURL(event.target.files[0]));
                handleUploadFile(event.target.files[0], "cover");
              }}
              accept="image/*"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Basic;

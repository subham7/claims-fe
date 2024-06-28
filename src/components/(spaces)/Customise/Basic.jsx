/* eslint-disable @next/next/no-img-element */
import { uploadFileToAWS } from "utils/helper";
import classes from "../Spaces.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addSpaceBasicData } from "redux/reducers/space";

const Basic = () => {
  const dispatch = useDispatch();
  const spaceBasicData = useSelector((state) => {
    return state.space.spaceBasicData;
  });
  const handleUploadFile = async (file, attribute) => {
    const response = await uploadFileToAWS(file);
    if (attribute === "logo") {
      dispatch(
        addSpaceBasicData({
          ...spaceBasicData,
          logo: response,
        }),
      );
    } else {
      dispatch(
        addSpaceBasicData({
          ...spaceBasicData,
          coverPic: response,
        }),
      );
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
          value={spaceBasicData.name}
          onChange={(event) => {
            dispatch(
              addSpaceBasicData({
                ...spaceBasicData,
                name: event.target.value,
              }),
            );
          }}
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
          value={spaceBasicData.description}
          onChange={(event) => {
            dispatch(
              addSpaceBasicData({
                ...spaceBasicData,
                description: event.target.value,
              }),
            );
          }}
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
            src={
              spaceBasicData.logo
                ? spaceBasicData.logo
                : "/assets/images/spaceLogo.png"
            }
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
                dispatch(
                  addSpaceBasicData({
                    ...spaceBasicData,
                    logo: URL.createObjectURL(event.target.files[0]),
                  }),
                );
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
            src={
              spaceBasicData.coverPic
                ? spaceBasicData.coverPic
                : "/assets/images/spaceBanner.jpg"
            }
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
                dispatch(
                  addSpaceBasicData({
                    ...spaceBasicData,
                    coverPic: URL.createObjectURL(event.target.files[0]),
                  }),
                );
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

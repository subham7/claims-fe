import {
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { TextField } from "@components/ui";
import Button from "@components/ui/button/Button";
import { makeStyles, useTheme } from "@mui/styles";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";

import "react-quill/dist/quill.snow.css";
import UploadIcon from "@mui/icons-material/Upload";
import { FIVE_MB } from "utils/constants";
import Image from "next/image";
import { createOrUpdateUser } from "api/club";
import { handleSignMessage, uploadFileToAWS } from "utils/helper";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch } from "react-redux";
import { useSignMessage } from "wagmi";

const useStyles = makeStyles((theme) => ({
  modalStyle: {
    width: "792px",
    backgroundColor: "#151515",
    marginTop: "80px",
  },
  dialogBox: {
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  textField: {
    width: "100%",
    fontSize: "18px",
    marginTop: "0.5rem",
  },
  wrapTextIcon: {
    fontSize: "22px",
    color: "#dcdcdc",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  error: {
    color: "red",
  },
  smallText: {
    fontSize: "14px",
    marginLeft: "10px",
  },
  bannerContainer: {
    margin: "20px 0",
    position: "relative",
    height: "200px",
  },
  bannerImage: {
    borderRadius: "8px",
    marginBottom: "12px",
    objectFit: "cover",
    width: "200px",
    height: "200px",
  },
  subtext: {
    color: "#707070",
    fontSize: "14px",
  },
  editor: {
    width: "100%",
    height: "auto",
    backgroundColor: theme.palette.background.default,
    fontSize: "18px",
    margin: "0.5rem 0",
    marginBottom: "30px",
  },
}));

const EditProfileDetails = ({
  open,
  onClose,
  wallet,
  userData,
  getUserProfileData,
}) => {
  const { signMessageAsync } = useSignMessage();
  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const uploadInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState("");

  const selectFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const readFileAsync = async () => {
    if (selectedFile) {
      return await uploadFileToAWS(selectedFile);
    }
    return null;
  };

  const sendRequest = async (data) => {
    try {
      const { signature } = await handleSignMessage(
        JSON.stringify(data),
        signMessageAsync,
      );

      const response = await createOrUpdateUser({ ...data, signature });
      if (response?.data) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateUIAfterSuccess = async () => {
    dispatch(
      setAlertData({
        open: true,
        message: "Details changed successfully",
        severity: "success",
      }),
    );
    await getUserProfileData();
    setLoaderOpen(false);
    onClose();
  };

  const updateUIAfterFailure = () => {
    setLoaderOpen(false);
    dispatch(
      setAlertData({
        open: true,
        message: "Details changing failed",
        severity: "error",
      }),
    );
  };

  const formik = useFormik({
    initialValues: {
      userName: userData?.userName,
      bio: userData?.bio,
      imgUrl: userData?.imgUrl,
      twitter: userData?.socialLinks?.twitter,
      telegram: userData?.socialLinks?.telegram,
      warpcast: userData?.socialLinks?.warpcast,
      website: userData?.socialLinks?.website,
    },
    onSubmit: async (values) => {
      setLoaderOpen(true);
      try {
        let fileLink = "";
        fileLink = await readFileAsync();
        const res = await sendRequest({
          userName: values?.userName,
          bio: values?.bio,
          imgUrl: fileLink ? fileLink : values?.imgUrl ?? "",
          socialLinks: {
            twitter: values?.twitter,
            telegram: values?.telegram,
            warpcast: values?.warpcast,
            website: values?.website,
          },
        });
        updateUIAfterSuccess();
      } catch (error) {
        updateUIAfterFailure();
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      PaperProps={{ classes: { root: classes.modalStyle } }}
      fullWidth
      maxWidth="lg">
      <DialogContent
        sx={{
          overflow: "hidden",
          backgroundColor: "#151515",
          padding: "3rem",
        }}>
        <form className={classes.form}>
          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Upload profile image
            </Typography>
            <span className={classes.smallText}>
              (recommended dimension - 1:1)
            </span>
            <p className={classes.error}>
              {selectedFile?.size > FIVE_MB
                ? "Image exceeds max size, please add image below 5 mb"
                : null}
            </p>
            {formik.values.imgUrl || selectedFile ? (
              <div className={classes.bannerContainer}>
                <Image
                  className={classes.bannerImage}
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : formik.values.imgUrl
                  }
                  height={200}
                  width={200}
                  alt="Banner Image"
                />
              </div>
            ) : null}
            <Button
              variant="normal"
              onClick={(e) => {
                uploadInputRef.current.click();
              }}>
              <UploadIcon fontSize="8px" />
              Upload
            </Button>
            <input
              name="banner"
              accept="image/*"
              type="file"
              id="select-image"
              style={{ display: "none" }}
              ref={uploadInputRef}
              onChange={selectFile}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Add Bio
            </Typography>
            <TextField
              name="bio"
              id="bio"
              placeholder="bio"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              error={formik.touched.bio && Boolean(formik.errors.bio)}
              helperText={formik.touched.bio && formik.errors.bio}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Name
            </Typography>
            <TextField
              name="userName"
              id="userName"
              placeholder="Name"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Website
            </Typography>
            <TextField
              name="website"
              id="website"
              placeholder="Website link"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.website}
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Twitter
            </Typography>
            <TextField
              name="twitter"
              id="twitter"
              placeholder="Link"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.twitter}
              error={formik.touched.twitter && Boolean(formik.errors.twitter)}
              helperText={formik.touched.twitter && formik.errors.twitter}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Warpcast
            </Typography>
            <TextField
              name="warpcast"
              id="warpcast"
              placeholder="Link"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.warpcast}
              error={formik.touched.warpcast && Boolean(formik.errors.warpcast)}
              helperText={formik.touched.warpcast && formik.errors.warpcast}
            />
          </Grid>

          <Grid item md={6} mb={2}>
            <Typography variant="inherit" className={classes.wrapTextIcon}>
              Telegram
            </Typography>
            <TextField
              name="telegram"
              id="telegram"
              placeholder="Link"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.telegram}
              error={formik.touched.telegram && Boolean(formik.errors.telegram)}
              helperText={formik.touched.telegram && formik.errors.telegram}
            />
          </Grid>

          <Grid container mt={2} spacing={3}>
            <Grid
              item
              xs
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}>
              <Button
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={selectedFile && selectedFile?.size > FIVE_MB}
                onClick={() => {
                  formik.handleSubmit();
                }}>
                {loaderOpen ? <CircularProgress size={25} /> : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDetails;

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
import React, { useEffect, useRef, useState } from "react";

import QuillEditor from "../../quillEditor";
import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";
import UploadIcon from "@mui/icons-material/Upload";
import { createClaimDetails, getClaimDetails } from "api/claims";
import { FIVE_MB } from "utils/constants";
import Image from "next/image";
import { editInfo, getClubInfo } from "api/club";
import { uploadFileToAWS } from "utils/helper";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch } from "react-redux";

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
    // margin: "16px 0 25px 0",
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
    width: "100%",
    height: "100%",
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

const EditDetails = ({
  open,
  setOpen,
  onClose,
  claimAddress = "",
  networkId,
  daoAddress = "",
  isClaims = false,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const uploadInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState("");
  const [bannerData, setBannerData] = useState();

  const selectFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchBannerDetails = async () => {
    try {
      const data = await getClaimDetails(claimAddress);
      setBannerData(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getClubInfoFn = async () => {
    try {
      const info = await getClubInfo(daoAddress);
      if (info.status === 200) setBannerData(info.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const readFileAsync = async () => {
    if (selectedFile) {
      return await uploadFileToAWS(selectedFile);
    }
    return null;
  };

  const sendRequest = async (values, fileLink = "") => {
    if (isClaims) {
      return await createClaimDetails({
        claimAddress,
        description: values.description,
        imageLinks: {
          banner: fileLink ? fileLink : bannerData?.imageLinks?.banner ?? "",
        },
        networkId,
        socialLinks: {
          twitter: values.twitter,
          discord: values.discord,
          telegram: values.telegram,
          website: values.website,
        },
        tweetText: values.tweetText,
      });
    } else {
      return await editInfo({
        daoAddress: daoAddress,
        bio: values.description,
        twitter: values.twitter,
        discord: values.discord,
        telegram: values.telegram,
        bannerImage: fileLink ? fileLink : bannerData?.bannerImage,
      });
    }
  };

  const updateUIAfterSuccess = async () => {
    setLoaderOpen(false);
    dispatch(
      setAlertData({
        open: true,
        message: "Details changed successfully",
        severity: "success",
      }),
    );
    if (isClaims) {
      await getClubInfo();
    }
    onClose(event, "cancel");
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
      description: "",
      twitter: "",
      discord: "",
      telegram: "",
      website: "",
      tweetText: "",
    },
    onSubmit: async (values) => {
      setLoaderOpen(true);
      try {
        let fileLink = "";
        fileLink = await readFileAsync();
        const res = await sendRequest(values, fileLink);
        updateUIAfterSuccess();
      } catch (error) {
        updateUIAfterFailure();
      }
    },
  });

  const setFormValuesFromBannerData = (bannerData, formik) => {
    const descriptionField = isClaims
      ? bannerData?.description
      : bannerData?.bio;
    const parsedDescription = ReactHtmlParser(descriptionField ?? "");
    const descriptionValue =
      descriptionField && parsedDescription ? parsedDescription[0] : "";

    const defaultValues = {
      description: descriptionValue,
      twitter: "",
      discord: "",
      telegram: "",
      tweetText: "",
    };

    if (isClaims) {
      formik.setValues({
        ...defaultValues,
        twitter: bannerData?.socialLinks?.twitter ?? "",
        discord: bannerData?.socialLinks?.discord ?? "",
        telegram: bannerData?.socialLinks?.telegram ?? "",
        tweetText: bannerData?.tweetText ?? "",
      });
    } else {
      formik.setValues({
        ...defaultValues,
        twitter: bannerData?.twitter ?? "",
        discord: bannerData?.discord ?? "",
        telegram: bannerData?.telegram ?? "",
      });
    }
  };

  useEffect(() => {
    if (isClaims && claimAddress) {
      fetchBannerDetails();
    } else if (daoAddress) {
      getClubInfoFn();
    }
  }, [claimAddress, isClaims, daoAddress]);

  useEffect(() => {
    setFormValuesFromBannerData(bannerData, formik);
  }, [bannerData]);

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
              Upload Banner{" "}
            </Typography>
            <span className={classes.smallText}>
              (recommended dimension - 16:8)
            </span>
            <p className={classes.error}>
              {selectedFile?.size > FIVE_MB
                ? "Image exceeds max size, please add image below 5 mb"
                : null}
            </p>

            {bannerData?.imageLinks?.banner || selectedFile ? (
              <div className={classes.bannerContainer}>
                <Image
                  className={classes.bannerImage}
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : bannerData?.imageLinks?.banner
                  }
                  fill
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
            <QuillEditor
              multiline
              rows={10}
              placeholder="Add description of your station"
              className={classes.editor}
              name="description"
              id="description"
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
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
              Discord
            </Typography>
            <TextField
              name="discord"
              id="discord"
              placeholder="Link"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.discord}
              error={formik.touched.discord && Boolean(formik.errors.discord)}
              helperText={formik.touched.discord && formik.errors.discord}
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

          {isClaims ? (
            <Grid item md={6} mb={2}>
              <Typography variant="inherit" className={classes.wrapTextIcon}>
                Twitter Text
              </Typography>

              <Typography variant="inherit" className={classes.subtext}>
                Use this &quot;;&quot; without spaces for a new line.
              </Typography>
              <TextField
                name="tweetText"
                id="tweetText"
                placeholder="Text"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tweetText}
                error={
                  formik.touched.tweetText && Boolean(formik.errors.tweetText)
                }
                helperText={formik.touched.tweetText && formik.errors.tweetText}
                multiline
                inputProps={{ maxLength: 280 }}
              />
            </Grid>
          ) : null}

          {/* Submit Button */}
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
                  setLoaderOpen(false);
                  onClose(event, "cancel");
                }}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={selectedFile && selectedFile?.size > FIVE_MB}
                onClick={() => formik.handleSubmit()}>
                {loaderOpen ? <CircularProgress size={25} /> : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDetails;

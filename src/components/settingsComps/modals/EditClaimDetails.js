import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { TextField } from "@components/ui";
import Button from "@components/ui/button/Button";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";

import QuillEditor from "../../quillEditor";
// import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";
import UploadIcon from "@mui/icons-material/Upload";

const useStyles = makeStyles({
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
});

const EditClaimDetails = (props) => {
  //   const { daoAddress, clubInfo, getClubInfo } = props;
  const { open, setOpen, onClose } = props;
  const classes = useStyles();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [failed, setFailed] = useState(false);
  const uploadInputRef = useRef(null);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setLoaderOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      banner: "",
      description: "",
      twitter: "",
      discord: "",
      telegram: "",
    },

    onSubmit: async (values) => {
      console.log(values);
      //   setLoaderOpen(true);
      //   const res = await editInfo({
      //     // daoAddress: daoAddress,
      //     banner: values.banner,
      //     bio: values.description,
      //     twitter: values.twitter,
      //     discord: values.discord,
      //     telegram: values.telegram,
      //   });
      //   if (res.status === 200) {
      //     setOpenSnackBar(true);
      //     setFailed(false);
      //     setOpen(false);
      //     setLoaderOpen(false);
      //     await getClubInfo();
      //     onClose(event, "cancel");
      //   } else {
      //     setOpenSnackBar(true);
      //     setFailed(true);
      //     setLoaderOpen(false);
      //   }
    },
  });

  //   useEffect(() => {
  //     const parsedDescription = ReactHtmlParser(clubInfo?.bio ?? "");
  //     // Update the formik initial values when clubInfo changes
  //     formik.setValues({
  //       description:
  //         clubInfo?.bio && parsedDescription ? parsedDescription[0] : "",
  //       twitter: clubInfo?.twitter ?? "",
  //       discord: clubInfo?.discord ?? "",
  //       telegram: clubInfo?.telegram ?? "",
  //     });
  //   }, [clubInfo]);

  return (
    <>
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
              <Typography className={classes.wrapTextIcon}>
                Upload Banner
              </Typography>
              <p>{formik.values.banner.name}</p>
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
                accept="image/*,video/mp4"
                type="file"
                id="select-image"
                style={{ display: "none" }}
                ref={uploadInputRef}
                onChange={(event) => {
                  formik.setFieldValue("banner", event.currentTarget.files[0]);
                }}
              />
            </Grid>
            <Grid item md={6} mb={2}>
              <Typography className={classes.wrapTextIcon}>Add Bio</Typography>
              <QuillEditor
                multiline
                rows={10}
                placeholder="Add description of your station"
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#0f0f0f",
                  fontSize: "18px",
                  margin: "0.5rem 0",
                  marginBottom: "30px",
                }}
                name="description"
                id="description"
                value={formik.values.description}
                onChange={(value) => formik.setFieldValue("description", value)}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            <Grid item md={6} mb={2}>
              <Typography className={classes.wrapTextIcon}>Twitter</Typography>
              <TextField
                name="twitter"
                placeholder="Paste URL here"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.twitter}
                error={formik.touched.twitter && Boolean(formik.errors.twitter)}
                helperText={formik.touched.twitter && formik.errors.twitter}
              />
            </Grid>

            <Grid item md={6} mb={2}>
              <Typography className={classes.wrapTextIcon}>Discord</Typography>
              <TextField
                name="discord"
                placeholder="Paste URL here"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.discord}
                error={formik.touched.discord && Boolean(formik.errors.discord)}
                helperText={formik.touched.discord && formik.errors.discord}
              />
            </Grid>

            <Grid item md={6} mb={2}>
              <Typography className={classes.wrapTextIcon}>Telegram</Typography>
              <TextField
                name="telegram"
                placeholder="Paste URL here"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telegram}
                error={
                  formik.touched.telegram && Boolean(formik.errors.telegram)
                }
                helperText={formik.touched.telegram && formik.errors.telegram}
              />
            </Grid>

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
                <Button onClick={() => formik.handleSubmit()}>
                  {loaderOpen ? <CircularProgress size={25} /> : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {!failed ? (
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            sx={{ width: "100%" }}>
            Details Changed Successfully!
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}>
            Details Change Failed!
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditClaimDetails;

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { editInfo } from "../../../api/club";
import QuillEditor from "../../quillEditor";
import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";

const useStyles = makeStyles({
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
    marginTop: "0.5rem",
  },
  wrapTextIcon: {
    fontSize: "22px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: "middle",
    display: "inline-flex",
  },
});

const EditClubInfo = (props) => {
  const { open, setOpen, onClose, daoAddress, clubInfo, getClubInfo } = props;
  const classes = useStyles();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setLoaderOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      description: clubInfo?.bio ?? "",
      twitter: clubInfo?.twitter ?? "",
      discord: clubInfo?.discord ?? "",
      telegram: clubInfo?.telegram ?? "",
    },

    onSubmit: async (values) => {
      setLoaderOpen(true);
      const res = await editInfo({
        daoAddress: daoAddress,
        bio: values.description,
        twitter: values.twitter,
        discord: values.discord,
        telegram: values.telegram,
      });
      if (res.status === 200) {
        setOpenSnackBar(true);
        setFailed(false);
        setOpen(false);
        setLoaderOpen(false);
        await getClubInfo();
        onClose(event, "cancel");
      } else {
        setOpenSnackBar(true);
        setFailed(true);
        setLoaderOpen(false);
      }
    },
  });

  useEffect(() => {
    const parsedDescription = ReactHtmlParser(clubInfo?.bio ?? "");
    // Update the formik initial values when clubInfo changes
    formik.setValues({
      description:
        clubInfo?.bio && parsedDescription ? parsedDescription[0] : "",
      twitter: clubInfo?.twitter ?? "",
      discord: clubInfo?.discord ?? "",
      telegram: clubInfo?.telegram ?? "",
    });
  }, [clubInfo]);

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
            backgroundColor: "#19274B",
            padding: "3rem",
          }}>
          <form onSubmit={formik.handleSubmit} className={classes.form}>
            <Grid item md={6} mb={2}>
              <Typography className={classes.wrapTextIcon}>Add Bio</Typography>
              <QuillEditor
                multiline
                rows={10}
                placeholder="Add description of your station"
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#121D38",
                  fontSize: "18px",
                  color: "#C1D3FF",
                  fontFamily: "Whyte",
                  margin: "0.5rem 0",
                  marginBottom: "30px",
                  borderRadius: "18px",
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
                className={classes.textField}
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
                className={classes.textField}
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
                className={classes.textField}
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
                  variant="primary"
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
                  variant="primary"
                  type="submit"
                  sx={{ display: "flex", alignItems: "center" }}>
                  {loaderOpen ? (
                    <CircularProgress
                      color="inherit"
                      sx={{ width: "inherit" }}
                    />
                  ) : (
                    "Save Changes"
                  )}
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

export default EditClubInfo;

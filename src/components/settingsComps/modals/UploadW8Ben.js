import { Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { generateRandomString, uploadFileToAWS } from "utils/helper";
import { createDocument } from "api/document";
import { editDepositConfig } from "api/deposit";
import BackdropLoader from "@components/common/BackdropLoader";
import { useDispatch } from "react-redux";
import { addAlertData } from "redux/reducers/general";

const UploadW8Ben = ({ daoAddress, walletAddress, depositConfig }) => {
  const hiddenFileInput = useRef(null);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!formik.values.pdfFile?.name) {
      hiddenFileInput.current.click();
    } else {
      formik.handleSubmit();
    }
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    formik.setFieldValue("pdfFile", fileUploaded);
  };

  const formik = useFormik({
    initialValues: {
      pdfFile: "",
    },
    onSubmit: async (value) => {
      try {
        setLoading(true);
        const fileLink = await uploadFileToAWS(value.pdfFile);
        const uploadIdentifier = generateRandomString(18);

        await createDocument({
          daoAddress: daoAddress.toLowerCase(),
          fileName: "W-8BEN Document",
          docIdentifier: uploadIdentifier,
          isTokenForSign: false,
          isSignable: false,
          isPublic: false,
          createdBy: walletAddress.toLowerCase(),
          isDocUploaded: true,
          docLink: fileLink,
        });

        await editDepositConfig(
          { uploadDocId: uploadIdentifier },
          daoAddress.toLowerCase(),
        );
        setLoading(false);
        dispatch(
          addAlertData({
            open: true,
            message: "W-8BEN enabled",
            severity: "success",
          }),
        );
      } catch (error) {
        console.log(error);
        setLoading(false);
        dispatch(
          addAlertData({
            open: true,
            message: "File upload failed",
            severity: "error",
          }),
        );
      }
    },
  });

  return (
    <Grid
      container
      py={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "40px",
      }}>
      <Grid width={"80%"} item>
        <TextField
          disabled
          onClick={handleClick}
          onChange={handleChange}
          value={
            formik.values.pdfFile?.name
              ? formik.values.pdfFile?.name
              : depositConfig?.uploadDocId
          }
          error={formik.touched.pdfFile && Boolean(formik.errors.pdfFile)}
          helperText={formik.touched.pdfFile && formik.errors.pdfFile}
          sx={{
            width: "100%",
          }}
        />

        <input
          type="file"
          accept=".pdf"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </Grid>
      <Grid
        // container
        sx={{ display: "flex", alignItems: "center" }}
        spacing={1}>
        <Button variant="contained" onClick={handleClick}>
          {formik.values.pdfFile?.name ? "Upload" : "Browse"}
        </Button>
      </Grid>

      <BackdropLoader isOpen={loading} />
    </Grid>
  );
};

export default UploadW8Ben;

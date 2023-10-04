import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { generateRandomString, uploadFileToAWS } from "utils/helper";
import { createDocument } from "api/document";
import { editDepositConfig } from "api/deposit";
import CustomAlert from "@components/common/CustomAlert";

const UploadW8Ben = ({ daoAddress, walletAddress, depositConfig }) => {
  const hiddenFileInput = useRef(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isSuccessFull, setIsSuccessFull] = useState(false);
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

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
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
        showMessageHandler();
        setIsSuccessFull(true);
        setMessage("W-8BEN enabled");
      } catch (error) {
        console.log(error);
        setLoading(false);
        showMessageHandler();
        setIsSuccessFull(false);
        setMessage("File upload failed");
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>

      {showMessage && (
        <CustomAlert alertMessage={message} severity={isSuccessFull} />
      )}
    </Grid>
  );
};

export default UploadW8Ben;

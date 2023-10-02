import { Button, TextField, Typography } from "@mui/material";
import classes from "./UploadDocModal.module.scss";
import React, { useRef } from "react";
import { useFormik } from "formik";
import { uploadFileToAWS } from "utils/helper";
import { editMembersFormData } from "api/deposit";
import { useAccount } from "wagmi";
import * as yup from "yup";
import CustomBackdrop from "@components/common/CustomBackdrop";

const UploadDocModal = ({
  daoAddress,
  onClose,
  uploadDocIdentifier,
  downloadUrl,
}) => {
  const { address: walletAddress } = useAccount();

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    formik.setFieldValue("pdfFile", fileUploaded);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      pdfFile: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required("Email is required"),
      pdfFile: yup.mixed().required("File is required"),
    }),
    onSubmit: async (values) => {
      try {
        const fileLink = await uploadFileToAWS(values.pdfFile);

        const data = {
          daoAddress: daoAddress.toLowerCase(),
          userAddress: walletAddress.toLowerCase(),
          email: values.email,
          docIdentifier: uploadDocIdentifier,
          docLink: fileLink,
          signature: null,
          formData: [],
        };
        const response = await editMembersFormData(data);
        onClose(response?.docIdentifier);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <CustomBackdrop onClick={onClose} />
      <div className={classes.modal}>
        <h2>Sign & upload W-8BEN</h2>
        <Typography variant="inherit" mt={1}>
          Fill the W-8BEN form & upload signed copy to deposit funds inside this
          station. Click{" "}
          <span
            onClick={() => window.open(downloadUrl, "_blank")}
            style={{
              color: "#2D55FF",
              cursor: "pointer",
            }}>
            here
          </span>{" "}
          to download the form.
        </Typography>

        <form className={classes.form}>
          <div>
            <Typography className={classes.label}>E-mail ID</Typography>
            <TextField
              className={classes.inputs}
              variant="outlined"
              name="email"
              id="email"
              type={"email"}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <Typography className={classes.label}>
              Upload signed copy
            </Typography>
            <TextField
              disabled
              onClick={handleClick}
              onChange={handleChange}
              value={formik.values?.pdfFile?.name}
              className={classes.inputs}
            />
            <input
              type="file"
              accept=".pdf"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>

          <div className={classes.dragContainer}>
            <Button variant="contained" onClick={handleClick}>
              Browse
            </Button>
            <Typography variant="inherit" mt={1}>
              Or drag & drop here
            </Typography>
          </div>

          <Button variant="contained" onClick={formik.handleSubmit}>
            Finish
          </Button>
        </form>
      </div>
    </>
  );
};

export default UploadDocModal;

import { Button, TextField, Typography } from "@mui/material";
import classes from "./UploadDocModal.module.scss";
import React, { useRef } from "react";
import { useFormik } from "formik";
import { uploadFileToAWS } from "utils/helper";
import { editMembersFormData } from "api/deposit";
import { useAccount } from "wagmi";
import * as yup from "yup";
import BackdropLoader from "@components/common/BackdropLoader";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { sentFileByEmail } from "api/document";

const UploadDocModal = ({
  daoAddress,
  onClose,
  uploadDocIdentifier,
  downloadUrl,
}) => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

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

        // For sending file to email

        const file = new File([values?.pdfFile], "document.pdf", {
          type: "application/pdf",
        });

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("email", values?.email);
        uploadFormData.append(
          "subject",
          `${clubData?.name} - Here's your signed copy of W8-BEN document.`,
        );
        uploadFormData.append(
          "body",
          `
Hello,

Here's a signed copy of the W8-BEN document - ${clubData?.name}. StationX does not store a copy of these agreements, so please download and save it for your records.

Cheers,
StationX`,
        );

        sentFileByEmail(uploadFormData);
        onClose(response?.docIdentifier);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <BackdropLoader showLoading={false} isOpen={true}>
        <div className={classes.modal}>
          <div className={classes.heading}>
            <h2>Sign & upload W-8BEN</h2>
            <AiOutlineClose onClick={onClose} className={classes.icon} />
          </div>
          <Typography variant="inherit" mt={1}>
            Fill the W-8BEN form & upload signed copy to deposit funds inside
            this station. Click{" "}
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
              <Typography variant="inherit" mt={1} className={classes.fileName}>
                {formik.values?.pdfFile?.name}
              </Typography>
            </div>

            <Button variant="contained" onClick={formik.handleSubmit}>
              Finish
            </Button>
          </form>
        </div>
      </BackdropLoader>
    </>
  );
};

export default UploadDocModal;

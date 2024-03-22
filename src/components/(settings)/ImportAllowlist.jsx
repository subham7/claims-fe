import React, { useRef } from "react";
import classes from "@components/(settings)/Settings.module.scss";

const ImportAllowlist = () => {
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <button className={classes.allowlistButton} onClick={handleClick}>
        Import Allowlist
      </button>
    </>
  );
};

export default ImportAllowlist;

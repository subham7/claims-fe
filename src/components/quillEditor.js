"use client";
import React, { useMemo } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { makeStyles } from "@mui/styles";
import "react-quill/dist/quill.snow.css";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "fit-content !important",
    borderRadius: "12px",
    "& .root": {
      height: "fit-content",
    },
    "& .ql-toolbar": {
      border: `1px solid ${theme.palette.divider}`,
      borderTopRightRadius: "12px",
      borderTopLeftRadius: "12px",
      borderBottom: `1px solid ${theme.palette.divider}`,
      "& .ql-picker-label:hover": {
        color: theme.palette.secondary.main,
      },
      "& .ql-picker-label.ql-active": {
        color: theme.palette.secondary.main,
      },
      "& .ql-picker-item:hover": {
        color: theme.palette.secondary.main,
      },
      "& .ql-picker-item.ql-selected": {
        color: theme.palette.secondary.main,
      },
      "& button:hover": {
        color: theme.palette.secondary.main,
        "& .ql-stroke": {
          stroke: theme.palette.secondary.main,
        },
      },
      "& button:focus": {
        color: theme.palette.secondary.main,
        "& .ql-stroke": {
          stroke: theme.palette.secondary.main,
        },
      },
      "& button.ql-active": {
        "& .ql-stroke": {
          stroke: theme.palette.secondary.main,
        },
      },
      "& .ql-stroke": {
        stroke: theme.palette.text.primary,
      },
      "& .ql-picker": {
        color: theme.palette.text.primary,
      },
      "& .ql-picker-options": {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        border: "none",
        boxShadow: theme.shadows[10],
        borderRadius: theme.shape.borderRadius,
      },
    },
    "& .ql-container": {
      height: "16vh",
      //   "border": "none",
      border: `1px solid ${theme.palette.divider}`,
      borderBottomRightRadius: "12px",
      borderBottomLeftRadius: "12px",
      "& .ql-editor": {
        fontFamily: theme.typography.fontFamily,
        fontSize: 16,
        color: theme.palette.text.primary,
        "&.ql-blank::before": {
          color: theme.palette.text.secondary,
        },
      },
    },
  },
  error: {
    "& .ql-container": {
      height: "16vh",
      //   "border": "none",
      border: `1px solid #d32f2f`,
      borderBottomRightRadius: "12px",
      borderBottomLeftRadius: "12px",
      "& .ql-editor": {
        fontFamily: theme.typography.fontFamily,
        fontSize: 16,
        color: theme.palette.text.primary,
        "&.ql-blank::before": {
          color: theme.palette.text.secondary,
        },
      },
    },
    "& .ql-toolbar": {
      border: `1px solid #d32f2f`,
    },
  },
}));

const QuillEditor = ({ className, error, ...rest }) => {
  // const ReactQuill =
  //   typeof window === "object" ? require("react-quill") : () => false;
  const classes = useStyles();
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );
  return (
    <ReactQuill
      className={clsx(classes.root, className, error ? classes.error : null)}
      {...rest}
    />
  );
};

// QuillEditor.propTypes = {
//   className: PropTypes.string
// };

export default QuillEditor;

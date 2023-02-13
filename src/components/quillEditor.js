"use client";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { makeStyles } from "@mui/styles";
import "react-quill/dist/quill.snow.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "height": "fit-content !important",
    "max-height": "20vh !important",
    "& .root": {
      height: "fit-content",
    },
    "& .ql-toolbar": {
      //   "borderLeft": "none",
      //   "borderTop": "none",
      //   "borderRight": "none",
      "border": `2px solid ${theme.palette.divider}`,
      "borderTopRightRadius": "12px",
      "borderTopLeftRadius": "12px",
      "borderBottom": `1px solid ${theme.palette.divider}`,
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
        "color": theme.palette.secondary.main,
        "& .ql-stroke": {
          stroke: theme.palette.secondary.main,
        },
      },
      "& button:focus": {
        "color": theme.palette.secondary.main,
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
      //   "border": "none",
      "border": `2px solid ${theme.palette.divider}`,
      "borderBottomRightRadius": "12px",
      "borderBottomLeftRadius": "12px",
      "& .ql-editor": {
        "fontFamily": theme.typography.fontFamily,
        "fontSize": 16,
        "color": theme.palette.text.primary,
        "&.ql-blank::before": {
          color: theme.palette.text.secondary,
        },
      },
    },
  },
}));

const QuillEditor = ({ className, ...rest }) => {
  // const ReactQuill =
  //   typeof window === "object" ? require("react-quill") : () => false;
  const classes = useStyles();
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );
  return <ReactQuill className={clsx(classes.root, className)} {...rest} />;
};

// QuillEditor.propTypes = {
//   className: PropTypes.string
// };

export default QuillEditor;

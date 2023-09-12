export const darkComponents = {
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: "#F5F5F5",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: "#151515",
        borderRadius: "10px",
        padding: "20px",
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      thumb: {
        color: "#2D55FF",
      },
      track: {
        "&:checked": {
          backgroundColor: "#2D55FF",
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        border: "none",
        backgroundColor: "#0F0F0F",
      },
    },
    variants: [
      {
        props: { variant: "tableBody" },
        style: {
          fontSize: "1.375em",
        },
      },
      {
        props: { variant: "tableHeading" },
        style: {
          fontSize: "1.375em",

          color: "#dcdcdc",
        },
      },
    ],
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        backgroundColor: "#0F0F0F",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        backgroundColor: "#0F0F0F",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundColor: "#151515",
        borderRadius: "20px",
      },
    },
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: "mainHeading" },
        style: {
          fontSize: "2.875em",

          color: "#F5F5F5",
        },
      },
      {
        props: { variant: "regularText" },
        style: {
          fontSize: "1.3125em",
          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "regularText2" },
        style: {
          fontSize: "1.1875em",

          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "regularText3" },
        style: {
          fontSize: "1.375em",
        },
      },
      {
        props: { variant: "regularText4" },
        style: {
          fontSize: "1.25em",
        },
      },
      {
        props: { variant: "regularText5" },
        style: {
          fontSize: "1.1875em",

          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "subHeading" },
        style: {
          fontSize: "1.875em",

          color: "#F5F5F5",
        },
      },
      {
        props: { variant: "cardFont1" },
        style: {
          fontSize: "1.3125em",
        },
      },
      {
        props: { variant: "cardFont2" },
        style: {
          fontSize: "0.9375em",
          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "title" },
        style: {
          fontSize: "3em",
          color: "#FFFFFF",
        },
      },
      {
        props: { variant: "proposalSubHeading" },
        style: {
          fontSize: "0.75em",
          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "proposalBody" },
        style: {
          fontSize: "1.3rem",
          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "settingText" },
        style: {
          fontSize: "1.375em",

          color: "#dcdcdc",
        },
      },
      {
        props: { variant: "getStartedClub" },
        style: {
          fontSize: "2.125em",

          color: "#0F0F0F",
        },
      },
      {
        props: { variant: "Docs" },
        style: {
          fontSize: "1.2em",
        },
      },
    ],
  },
  MuiIcon: {
    styleOverrides: {
      root: {
        fontSize: "30px",
      },
    },
  },
  MuiCardMedia: {
    variants: [
      {
        props: { variant: "collectionImage" },
        style: {
          width: "100%",
          padding: 0,
        },
      },
    ],
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        backgroundColor: "#00000000",
        boxShadow: "none",
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        backgroundColor: "#19274b",
      },
      colorPrimary: {
        backgroundColor: "#19274b",
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        backgroundColor: "#0F0F0F",
      },
    },
  },
  MuiCalendarPicker: {
    styleOverrides: {
      root: {
        backgroundColor: "#151515",
      },
    },
  },
};

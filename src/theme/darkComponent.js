export const darkComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        background: "#3181F6",
        "&:hover": {},
        borderRadius: "10px",
        opacity: 1,
        padding: "10px 30px",
        color: "#fff",
        textTransform: "none",
      },
    },
    variants: [
      {
        props: { variant: "primary" },
        style: {
          fontSize: "1.3rem",
          fontFamily: "Whyte",
          borderRadius: "30px",
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      },
      {
        props: { variant: "navBar" },
        style: {
          background: "#111D38 0% 0% no-repeat padding-box",
          border: "1px solid #C1D3FF40",
          opacity: "1",
          fontSize: "1.3rem",
          fontFamily: "Whyte",
          borderRadius: "30px",
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      },
      {
        props: {variant: "wideButton"},
        style: {
          paddingLeft: "3.125vw",
          paddingRight: "3.125vw",
          fontSize: "1.3rem",
          borderRadius: "30px",
          fontFamily: "Whyte",
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      }
    ]
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: "#19274B",
        borderRadius: "20px",
        padding: "20px",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        backgroundColor: "#142243",
        backgroundImage: "none",
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      thumb: {
        color: "#3B7AFD",
      },
      track: {
        "&:checked": {
          backgroundColor: "#3B7AFD",
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        border: "none",
        backgroundColor: "#142243",
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        backgroundColor: "#111D38",
      }
    }
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundColor: "#19274B",
        borderRadius: "20px",
      },
    }
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: "mainHeading" },
        style: {
          fontSize: "2.875em",
          fontFamily: "Whyte",
          color: "#F5F5F5"
        }
      },
      {
        props: { variant: "regularText" },
        style: {
          fontFamily: "Whyte",
          fontSize: "1.3125em",
          color: "#C1D3FF"
        }
      }
    ]
  },
  MuiAvatar: {
    variants: [
      {
        props: { variant: "clubSelect" },
        style: {
          padding: "4vh",
          backgroundColor: "#C1D3FF33",
          color: "#C1D3FF",
          fontSize: "2rem",
          fontFamily: "Whyte",
          textTransform: "uppercase",
        }
      },
      {
        props: { variant: "clubSelect2" },
        style: {
          padding: "5vh",
          backgroundColor: "#C1D3FF33",
          color: "#C1D3FF",
          fontSize: "3rem",
          fontFamily: "Whyte",
          textTransform: "uppercase",
        }
      }
    ]
  },
  MuiIcon: {
    styleOverrides: {
      root: {
        fontSize: "30px"
      }
    }
  }
}

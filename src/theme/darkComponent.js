export const darkComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        background: "#3B7AFD",
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
          borderRadius: "30px",
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      },
      {
        props: { variant: "cancel" },
        style: {
          fontSize: "1.3rem",
          borderRadius: "30px",
          "&:hover": {
            background: "#F5F5F5",
            color: "#D55438",
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
          borderRadius: "30px",
          "&:hover": {
            background: "#111D38 0% 0% no-repeat padding-box",
            boxShadow: "0px 0px 12px #3B7AFD40",
            border: "1px solid #C1D3FF40",
            opacity: "1"
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
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      },
      {
        props: { variant: "transparent" },
        style: {
          backgroundColor: "#3181F600",
          borderRadius: "30px",
          opacity: "100%"
        }
      },
      {
        props: { variant: "transparentWhite" },
        style: {
          border: "1px solid #C1D3FF40",
          background: "#19274B",
          fontSize: "1.3rem",
          borderRadius: "30px",
          "&:hover": {
            background: "#F5F5F5",
            color: "#3B7AFD",
          },
        }
      },
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
    variants: [
      {
        props: { variant: "noProposalCard" },
        style: {
          background: "transparent linear-gradient(270deg, #3B7AFD 0%, #19274B 100%) 0% 0% no-repeat padding-box"
        }
      }
    ]
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        backgroundColor: "#111D38",
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
    },
    variants: [
      {
        props: { variant: "tableBody" },
        style: {
          fontSize: "1.375em",
          fontFamily: "Whyte",
        }
      },
      {
        props: { variant: "tableHeading" },
        style: {
          fontSize: "1.375em",
          fontFamily: "Whyte",
          color: "#C1D3FF",
        }
      },
    ]
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        backgroundColor: "#111D38",
      }
    },
    variants: [
      {
        props: { variant: "dashboardSearch" },
        style: {
          width: "28.5vw",
          height: "auto",
          color: "#C1D3FF",
          background: "#111D38 0% 0% no-repeat padding-box",
          border: "1px solid #C1D3FF40",
          borderRadius: "30px",
        }
      }
    ]
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        backgroundColor: "#111D38",
      }
    },
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
      },
      {
        props: { variant: "regularText2" },
        style: {
          fontSize: "1.1875em",
          fontFamily: "Whyte",
          color: "#C1D3FF",
        }
      },
      {
        props: { variant: "regularText3" },
        style: {
          fontSize: "1.375em",
          fontFamily: "Whyte",
        }
      },
      {
        props: { variant: "regularText4" },
        style: {
          fontSize: "1.25em",
          fontFamily: "Whyte",
        }
      },
      {
        props: { variant: "regularText5" },
        style: {
          fontSize: "1.1875em",
          fontFamily: "Whyte",
          color: "#C1D3FF",
        }
      },
      {
        props: { variant: "subHeading" },
        style: {
          fontSize: "1.875em",
          fontFamily: "Whyte",
          color: "#F5F5F5",
        }
      },
      {
        props: { variant: "cardFont1" },
        style: {
          fontFamily: "Whyte",
          fontSize: "1.3125em",
        }
      },
      {
        props: { variant: "cardFont2" },
        style: {
          fontFamily: "Whyte",
          fontSize: "0.9375em",
          color: "#C1D3FF",
        }
      },
      {
        props: { variant: "textLink" },
        style: {
          fontSize: "1.5em",
          color: "#FFFFFF",
          backgroundColor: "#19274B"
        }
      },
      {
        props: { variant: "title"},
        style: {
          fontFamily: "Whyte",
          fontSize: "3em",
          color: "#FFFFFF",
        }
      },
      {
        props: { variant: "proposalSubHeading" },
        style: {
          fontSize: "0.75em",
          color: "#C1D3FF",
        }
      },
      {
        props: { variant: "proposalBody" },
        style: {
          fontSize: "1.3rem",
          color: "#C1D3FF"
        }
      },
      {
        props: { variant: "settingText" },
        style: {
          fontSize: "1.375em",
          fontFamily: "Whyte",
          color: "#C1D3FF",
        }
      },
      {
        props: { variant: "getStartedClub" },
        style: {
          fontSize: "2.125em",
          fontFamily: "Whyte",
          color: "#111D38"
        }
      },
      {
        props: { variant: "Docs" },
        style: {
          fontSize: "1.2em",
          fontFamily: "Whyte",
          
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
  },
  MuiCardMedia: {
    variants: [
      {
        props: { variant: "collectionImage"},
        style: {
          width:"100%",
          padding: 0,
        }
      },
    ]
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        backgroundColor: "#00000000",
        boxShadow: "none"
      }
    }
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        backgroundColor: "#19274b",
      },
      colorPrimary: {
        backgroundColor: "#19274b",
      }
    }
  },
  MuiList: {
    styleOverrides: {
      root: {
        backgroundColor: "#111D38",
      }
    }
  },
  MuiCalendarPicker: {
    styleOverrides: {
      root: {
        backgroundColor: "#19274b",
      }
    }
  },

}

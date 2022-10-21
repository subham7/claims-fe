import * as React from "react"
import { styled, alpha } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import EditIcon from "@mui/icons-material/Edit"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { networkType } from "../data/network"
import { switchNetwork } from "../utils/wallet"
import { fetchConfig, fetchConfigById } from "../api/config"
import { updateDynamicAddress } from "../api"
import Web3 from "web3"
import { RINKEYBY_RPC_URL, GOERLI_RPC_URL, POLYGON_RPC_URL } from "../api"

const StyledMenu = styled((props) => (
  <Menu
    overflow="visible"
    filter="drop-shadow(0px 2px 8px rgba(0,0,0,0.32))"
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    border: "1px solid #C1D3FF40",
    marginTop: theme.spacing(1),
    minWidth: 280,
    color: theme.palette.mode === "light" ? "#19274B" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
      backgroundColor: "#19274B",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#F5F5F5",
        marginRight: theme.spacing(1.5),
        backgroundColor: "#19274B",
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
        border: "1px solid #C1D3FF40",
      },
    },
  },
}))

export default function NetworkSwitcher() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const router = useRouter()
  const [networks, setNetworks] = useState([])
  const [networksFetched, setNetworksFetched] = useState(false)
  const activeNetworkName = useSelector((state) => {
    return state.gnosis.networkName
  })
  const [activeNetwork, setActiveNetwork] = useState(activeNetworkName)
  const [networkDetails, setNetworkDetails] = useState([])
  const [networkDetailsFetched, setNetworkDetailsFetched] = useState(false)

  const fetchNetworks = () => {
    const networkData = fetchConfig()
    networkData.then((result) => {
      if (result.status != 200) {
        setNetworksFetched(false)
      } else {
        setNetworks(result.data)
        setNetworksFetched(true)
        setActiveNetwork(result.data[0].name)
      }
    })
  }

  const fetchNetworksById = (networkId) => {
    const networkData = fetchConfigById(networkId)
    networkData.then((result) => {
      if (result.status != 200) {
        setNetworkDetailsFetched(false)
      } else {
        setNetworkDetails(result.data)
        setNetworkDetailsFetched(true)
      }
    })
  }

  const fetchDynamicAddresses = () => {
    if (networksFetched) {
      const networksAvailable = []
      networks.forEach((network) => {
        networksAvailable.push(network.networkId)
      })
      const web3 = new Web3(Web3.givenProvider)
      web3.eth.net
        .getId()
        .then((networkId) => {
          if (!networksAvailable.includes(networkId)) {
            setOpen(true)
          }
          updateDynamicAddress(networkId, dispatch)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    if (activeNetworkName) {
      setActiveNetwork(activeNetworkName)
    }
  }, [activeNetworkName])

  useEffect(() => {
    fetchNetworks()
    fetchDynamicAddresses()
  }, [networksFetched])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNetworkChange = async (data) => {
    fetchNetworksById(data.networkId)
    if (networkDetailsFetched) {
      let rpcURL = null
      if (data.networkId == 4) {
        rpcURL = RINKEYBY_RPC_URL
      }
      if (data.networkId == 5) {
        rpcURL = GOERLI_RPC_URL
      }
      if (data.networkId == 137) {
        rpcURL = POLYGON_RPC_URL
      }
      console.log("data.networkId", data.networkId)
      const switched = await switchNetwork(networkDetails[0].networkHex, rpcURL)
      if (switched) {
        setActiveNetwork(data.name)
        fetchDynamicAddresses()
        setAnchorEl(null)
      }
    }
  }

  return (
    <div>
      <Button
        sx={{ mr: 2, mt: 2 }}
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="navBar"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {activeNetworkName ? activeNetworkName : activeNetwork}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
      >
        {networksFetched
          ? networks.map((data, networkId) => {
              return (
                <MenuItem
                  key={networkId}
                  onClick={() => handleNetworkChange(data)}
                  disableRipple
                >
                  {data.name}
                </MenuItem>
              )
            })
          : null}
      </StyledMenu>
    </div>
  )
}

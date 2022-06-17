import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { onboard, disconnectWallet } from '../utils/wallet';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  navButton: {
    borderRadius: "10px",
    width: "327px",
    height: "auto",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    opacity: "1",
    fontSize: "18px",
    marginTop: "15px"
  }
})

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? '#19274B' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
      backgroundColor: "#19274B",
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        backgroundColor: "#19274B"
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function AccountButton(props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuItems, setMenuItems] = React.useState(true);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDisconnect = async () => {
    const [primaryWallet] = onboard.state.get().wallets
    await onboard.disconnectWallet({ 'label': primaryWallet.label })
    disconnectWallet(dispatch)
    setAnchorEl(null)
    setMenuItems(false)
  };

  return (
    <div>
      <Button
        className={classes.navButton}
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />
        }
      >
        {props.accountDetail !== null ? (props.accountDetail.substring(0, 6) + ".........." + props.accountDetail.substring(props.accountDetail.length - 4)) : null}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        close={handleClose}
        onDisconnect={handleDisconnect}
      >
        {menuItems && (
          <MenuItem onClick={handleDisconnect} disableRipple>
            <EditIcon />
            Disconnect
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}

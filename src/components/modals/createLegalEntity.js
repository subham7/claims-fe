import { makeStyles } from '@mui/styles'
import React from 'react'
import {IoMdClose} from 'react-icons/io'

const useStyles = makeStyles({
    backdrop: {
        position:'fixed',
        height:'100vh',
        width: "100vw",
        top: 0,
        left: 0,
        background: '#000000',
        opacity: 0.85,
        zIndex: 2000
    },
    modal : {
        width: '550px',
        background: '#111D38',
        position: 'fixed',
        top: '50%',
        left:'50%',
        transform: 'translateX(-50%) translateY(-50%)',
        zIndex: 2002,
        padding: '28px 25px',
        borderRadius: '20px',
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;"
    },

    title: {
        letterSpacing: '0.4px',
        fontFamily: 'sans-serif',
        fontSize: '28px'
    },

    subtitle : {
        color: '#C1D3FF',
        fontSize: '16px',
        marginBottom: '6px'
    },

    btn: {
        background: "#3B7AFD",
        borderRadius: '10px',
        padding: "13px 30px",
        marginTop: "20px",
        border: "none",
        cursor: "pointer",
        color:"white",
        fontWeight: 500,
        letterSpacing: '0.6px',
        fontSize: "16px"
    },

    relative: {
        position: 'relative'
    },

    icon: {
        position: 'absolute',
        top: '-23px',
        right: 0,
        cursor: 'pointer'
    }


})


const Backdrop = ({onClose}) => {

    const classes = useStyles()
    return <div onClick={onClose} className={classes.backdrop}></div>
}

const CreateLegalEntity = ({onClose}) => {
    const classes = useStyles()
  return (
    <>
        <Backdrop onClose={onClose} />
        <div className={classes.modal}>
            <div className={classes.relative}>
                <h2 className={classes.title}>Create a legal entity</h2>
                <p className={classes.subtitle}>Create a legal entity for this Station & invite members to sign the document by sharing a private link. (Sharing publicly may violate security laws)</p>
                <button className={classes.btn}>Let's Start</button>
                <IoMdClose onClick={onClose} className={classes.icon} size={20} />
            </div>
        </div>
    </>
  )
}

export default CreateLegalEntity
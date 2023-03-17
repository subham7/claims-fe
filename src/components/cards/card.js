import { makeStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 30px 30px 30px',
    borderRadius: '10px',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    // margin: '0 auto',
    width: '381px',
    background: '#142243',
    cursor: 'pointer',
    height: 'fit-content'
  },
  img: {
    objectFit: 'contain'
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    color: 'white',
    marginBottom: 4
  },
  subtitle: {
    fontSize: '14px',
    color: "lightgray",
    marginTop: 0
  }
});

const NewCard = ({ imgSrc, title, subtitle, onClick }) => {
  const classes = useStyles();



  return (
    <div onClick={onClick} className={classes.card}>
      <Image
        className={classes.img}
        src={imgSrc}
        alt={title}
        width={232}
        height={195}
      />
      <h2 className={classes.title}>{title}</h2>
      <p className={classes.subtitle}>{subtitle}</p>
    </div>
  );
};

export default NewCard;

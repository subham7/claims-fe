import React from "react";
import classes from "./ERC721.module.scss";
import ReactHtmlParser from "react-html-parser";

const About = ({ bio }) => {
  return (
    <div className={classes.aboutContainer}>
      <p className={classes.subtitle}>About</p>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "scroll",
          margin: "20px 0",
        }}>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactHtmlParser(bio),
          }}></div>
      </div>
    </div>
  );
};

export default About;

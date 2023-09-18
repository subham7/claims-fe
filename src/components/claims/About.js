import React from "react";
import classes from "./NewClaim.module.scss";
import ReactHtmlParser from "react-html-parser";

const About = ({ bio }) => {
  return (
    <div>
      <h3 className={classes.header}>About</h3>
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: ReactHtmlParser(bio),
          }}></div>
      </div>
    </div>
  );
};

export default About;

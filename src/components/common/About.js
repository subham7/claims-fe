import React, { useState } from "react";
import classes from "../claims/Claim.module.scss";
import ReactHtmlParser from "react-html-parser";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

const About = ({ bio }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <h3 className={classes.header}>About</h3>
      <div
        className={classes.about}
        dangerouslySetInnerHTML={{
          __html: ReactHtmlParser(showMore ? bio : bio.slice(0, 400)),
        }}></div>

      {bio.length > 400 ? (
        <div
          className={classes.showMore}
          onClick={() => {
            setShowMore(!showMore);
          }}>
          <div>
            {showMore ? (
              <BiSolidUpArrow size={13} />
            ) : (
              <BiSolidDownArrow size={13} />
            )}
          </div>
          {showMore ? "Read Less" : "Read More"}
        </div>
      ) : null}
    </>
  );
};

export default About;

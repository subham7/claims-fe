import React, { useState } from "react";
import classes from "./NewClaim.module.scss";
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
          __html: ReactHtmlParser(showMore ? bio : bio.slice(0, 200)),
        }}></div>

      {bio.length > 200 && (
        <p
          className={classes.showMore}
          onClick={() => {
            setShowMore(!showMore);
          }}>
          <span>
            {showMore ? (
              <BiSolidUpArrow size={13} />
            ) : (
              <BiSolidDownArrow size={13} />
            )}
          </span>
          {showMore ? "Read Less" : "Read More"}
        </p>
      )}
    </>
  );
};

export default About;

import React, { useEffect, useState } from "react";
import classes from "../claims/Claim.module.scss";
import ReactHtmlParser from "react-html-parser";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

import { parseHyperlinks } from "utils/replaceLinks";

const About = ({ bio }) => {
  const [showMore, setShowMore] = useState(false);
  const [content, setContent] = useState("");

  const transformContent = async () => {
    setContent(
      bio
        ? parseHyperlinks(
            ReactHtmlParser(showMore ? bio : bio.slice(0, 600))[0],
          )
        : null,
    );
  };

  useEffect(() => {
    transformContent();
  }, [showMore, bio]);

  return (
    <>
      <h3 className={classes.header}>About</h3>
      <div
        className={classes.about}
        dangerouslySetInnerHTML={{
          __html: content,
        }}></div>

      {bio.length > 600 ? (
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

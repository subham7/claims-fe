import React, { useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import ReactHtmlParser from "react-html-parser";
import { subgraphQuery } from "../../../../utils/subgraphs";
import { SUBGRAPH_URL_POLYGON } from "../../../../api";
import { QUERY_LATEST_MEMBERS } from "../../../../api/graphql/queries";
import { returnRemainingTime } from "../../../../utils/helper";

const About = ({ bio, daoAddress }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const queryMembers = async () => {
      const users = await subgraphQuery(
        SUBGRAPH_URL_POLYGON,
        QUERY_LATEST_MEMBERS(daoAddress),
      );
      setMembers(users?.users);
    };

    queryMembers();
  }, [daoAddress]);

  return (
    <div className={classes.container}>
      <div className={classes.aboutContainer}>
        <p className={classes.subheading}>About</p>
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
      <div className={classes.activityContainer}>
        <p className={classes.subheading}>Activity</p>

        {members?.map((member) => (
          <div key={member?.userAddress} className={classes.flexContainer}>
            <p>
              {member?.userAddress.slice(0, 10)}....
              {member?.userAddress.slice(member?.userAddress.length - 5)} joined
              this station
            </p>
            <p className={classes.time}>
              {" "}
              {returnRemainingTime(+member?.timeStamp)} ago
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;

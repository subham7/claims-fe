import React, { useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import ReactHtmlParser from "react-html-parser";
import { returnRemainingTime } from "../../../utils/helper";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import { useAccount, useNetwork } from "wagmi";

const About = ({ bio, daoAddress }) => {
  const [members, setMembers] = useState([]);
  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  useEffect(() => {
    const queryLatestMembers = async () => {
      try {
        const { users } = queryLatestMembersFromSubgraph(daoAddress, networkId);
        if (users) setMembers(users);
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress && networkId && daoAddress) queryLatestMembers();
  }, [daoAddress, walletAddress, networkId]);

  return (
    <div className={classes.container}>
      <div className={classes.aboutContainer}>
        <p className={classes.subheading}>About</p>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "scroll",
            margin: "16px 0",
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

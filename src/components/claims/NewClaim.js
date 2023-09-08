import ProgressBar from "@components/progressbar";
import Button from "@components/ui/button/Button";
import Image from "next/image";
import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import classes from "./NewClaim.module.scss";

const DUMMY_ACTIVITIES = [
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
  {
    address: "0x12e56bCD9Fb726574BAdA826594bfdFeBD9f4304",
    amount: 100,
    tokenSymbol: "MEME",
  },
];

const NewClaim = () => {
  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <p className={classes.active}>Active</p>
          <h1>MEME</h1>
          <p>This drop closes on Aug 15, 2023 at 9:47am (UTC)</p>

          <div className={classes.progress}>
            <p>100% claimed</p>
            <ProgressBar value={10} />
          </div>

          <div className={classes.inputContainer}>
            <div>
              <input
                name="tokenInput"
                id="tokenInput"
                // onChange={formik.handleChange}
                onWheel={(event) => event.target.blur()}
                autoFocus
                type={"number"}
                placeholder="0"
              />
              <p className={classes.smallFont}>$1322.70</p>
            </div>

            <div className={classes.tokenContainer}>
              <p className={classes.token}>USDC</p>
              <p className={classes.smallFont}>
                Available: 1000.0 <span>Max</span>
              </p>
            </div>
          </div>

          <Button className={classes.claim} variant="normal">
            Claim now
          </Button>
        </div>

        <div>
          <div className={classes.socials}>
            <BsTwitter />
            <IoLogoDiscord />
            <BiLogoTelegram />
          </div>
        </div>
      </section>
      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          <Image
            src="/assets/images/newBanner.png"
            height={150}
            width={640}
            alt="Banner Image"
          />
          <h1>This is a BIG drop reward for all the funds.</h1>
        </div>

        <div>
          <h3 className={classes.header}>About</h3>
          <p>
            Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of “de Finibus
            Bonorum et Malorum” The standard chunk of Lorem Ipsum used since the
            1500s is reproduced below for those interested. Sections 1.10.32 and
            1.10.33 from “de Finibus Bonorum et Malorum” by Cicero are also
            reproduced in their exact original form, accompanied by English
            versions from the 1914 translation by H. Rackham.
          </p>
        </div>

        <div className={classes.whoCanClaimContainer}>
          <h3 className={classes.header}>Who can claim?</h3>

          <div>
            <h4>Everyone</h4>
            <p>Upto 100 MEME on first-come first serve basis.</p>
          </div>
        </div>

        <div>
          <h3 className={classes.header}>Activity</h3>

          <div className={classes.activities}>
            {DUMMY_ACTIVITIES.map((activity, index) => (
              <div className={classes.activity} key={index}>
                <div>
                  <Image
                    src={`/assets/NFT_IMAGES/${Math.floor(
                      Math.random() * 11,
                    )}.png`}
                    height={25}
                    width={25}
                    alt="icon"
                  />
                  <p>{`${activity.address.slice(
                    0,
                    7,
                  )}....${activity.address.slice(-7)}`}</p>
                </div>
                <p>
                  {activity.amount} <span>{activity.tokenSymbol}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewClaim;

import Image from "next/image";
import React from "react";
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vulputate
        dolor mollis dui fermentum, eget volutpat velit rutrum. Nunc id ligula
        ut augue fringilla tempus. Aenean eu varius ligula, at viverra magna.
        Curabitur nisl elit, tempor eget euismod eget, maximus mattis ex.
        Quisque interdum bibendum sodales. Fusce volutpat, metus et pretium
        lobortis, nulla diam convallis enim, a eleifend mi nunc in nunc. Nulla
        facilisi. Nullam quis urna condimentum, egestas sem sed, malesuada
        risus. Sed non fringilla arcu, in luctus erat. Vestibulum imperdiet nibh
        quis justo aliquet venenatis. Cras non gravida ex, sed dictum purus.
        Integer molestie eleifend ornare. Donec aliquam ipsum eu ligula
        ullamcorper, et tincidunt neque sollicitudin. Donec cursus fringilla
        eros nec venenatis. Duis ut luctus leo. Nam tincidunt velit sed nibh
        finibus fermentum. Pellentesque habitant morbi tristique senectus et
        netus et malesuada fames ac turpis egestas. Vivamus dignissim nibh at
        semper dictum. Vivamus vehicula lacinia arcu vel maximus. Proin ut urna
        nulla. Cras euismod finibus lacus quis tincidunt. Proin semper non nulla
        sit amet pharetra. Lorem ipsum dolor sit amet, consectetur adipiscing
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

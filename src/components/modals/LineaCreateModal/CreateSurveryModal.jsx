import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const CreateSurveyModal = ({ onClose }) => {
  useLockBodyScroll(true);

  return (
    <Modal onClose={onClose} className={classes.modal}>
      <div className={classes.campaignModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
            Create a poll inside the Station
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Go to activity & click on &quot;Propose&quot;
        </p>

        <Image
          src={"/assets/campaign/proposeButton.png"}
          width={700}
          height={80}
          alt="propose"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. Click on &quot;Create a Survey&quot;
        </p>

        <Image
          src={"/assets/campaign/createSurvey.png"}
          width={600}
          height={350}
          alt="survey"
        />

        <p
          style={{
            marginTop: "20px",
          }}
          className={classes.subtext}>
          3. Add a title, description, deadline & options. You can add or remove
          options (min. 2 options are needed to create a poll)
        </p>

        <Image
          style={{
            marginTop: "20px",
          }}
          src={"/assets/campaign/createSurveyForm.png"}
          width={600}
          height={500}
          alt="surveyForm"
        />

        <p className={classes.subtext}>4. Click Submit to start the poll</p>
      </div>
    </Modal>
  );
};

export default CreateSurveyModal;

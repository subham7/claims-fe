import Modal from "@components/common/Modal/Modal";
import classes from "./CreateSpaceModal.module.scss";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { createSpace } from "api/space";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";

const CreateSpaceModal = ({ setShowCreateSpaceModal }) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { address } = useAccount();

  const handleCreateSpace = async () => {
    if (name) {
      const spaceData = {
        name: name,
        description: "",
        logo: "",
        creator: address,
        managers: [],
        stations: [],
        isPrivate: false,
        isActive: true,
        allowlistId: "",
        tokenGating: {
          isActive: true,
          operator: "and",
          tokens: [
            {
              address: "",
              quantity: 1,
            },
          ],
        },
        links: {
          warpcast: "http://warpcast.com",
          twitter: "http://twitter.com/",
          telegram: "http://telegram.com/",
          website: "http://space.com",
          discord: "http://discord.com/",
          instagram: "http://instagram.com/",
          reddit: "http://reddit.com/",
        },
      };
      const response = await createSpace(spaceData);
      console.log(response);
      dispatch(
        setAlertData(
          generateAlertData("Space created successfully!", "success"),
        ),
      );
      setIsLoading(false);
      setShowCreateSpaceModal(false);
    } else {
      setIsLoading(false);
      dispatch(setAlertData(generateAlertData("Please enter a name", "error")));
    }
  };
  return (
    <Modal className={classes.createModal}>
      <div className={classes.createSpace}>
        <button
          className={classes.closeButton}
          onClick={() => setShowCreateSpaceModal(false)}>
          <IoClose size={25} />
        </button>
      </div>
      <h2>Create a space</h2>
      <p className={classes.description}>
        Spaces allow you to bundle different stations together and feature them
        in one place.
      </p>
      <h3 className={classes.label}>Name</h3>
      <p className={classes.helper}>The name of your space.</p>
      <div className={classes.form}>
        <input
          type="text"
          placeholder="Space name"
          className={classes.input}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          required
        />
        <button
          className={classes.button}
          onClick={() => {
            setIsLoading(true);
            handleCreateSpace();
          }}>
          {isLoading ? "Creating a space..." : "Create"}
        </button>
      </div>
    </Modal>
  );
};

export default CreateSpaceModal;

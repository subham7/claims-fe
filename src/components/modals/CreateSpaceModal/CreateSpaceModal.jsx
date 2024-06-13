import Modal from "@components/common/Modal/Modal";
import classes from "./CreateSpaceModal.module.scss";
import { IoClose } from "react-icons/io5";

const CreateSpaceModal = ({ setShowCreateSpaceModal }) => {
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
        <input type="text" placeholder="Space name" className={classes.input} />
        <button className={classes.button}>Create</button>
      </div>
    </Modal>
  );
};

export default CreateSpaceModal;

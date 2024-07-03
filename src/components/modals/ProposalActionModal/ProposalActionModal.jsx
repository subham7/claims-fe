import Modal from "@components/common/Modal/Modal";
import classes from "./ProposalActionModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import { Tooltip } from "@mui/material";

const ProposalActionModal = ({
  setShowActionModal,
  setShowDistributeModal,
  setShowSendAssetsModal,
  setShowMintModal,
}) => {
  return (
    <Modal className={classes.modal}>
      <div className={classes.title}>
        <h2
          style={{
            fontSize: "1.85rem",
            fontWeight: "600",
          }}>
          Quick Actions
        </h2>
        <button
          className={classes.closeButton}
          onClick={() => {
            setShowActionModal(false);
          }}>
          <RxCross2 size={25} />
        </button>
      </div>
      <div className={classes.actions}>
        <button
          className={classes.actionButton}
          onClick={() => {
            setShowActionModal(false);
            setShowSendAssetsModal(true);
          }}>
          Send
        </button>
        <button
          className={classes.actionButton}
          onClick={() => {
            setShowActionModal(false);
            setShowDistributeModal(true);
          }}>
          Distribute
        </button>
        <Tooltip title="Coming soon">
          <button className={classes.actionButton} disabled>
            Swap
          </button>
        </Tooltip>
        <button
          className={classes.actionButton}
          onClick={() => {
            setShowActionModal(false);
            setShowMintModal(true);
          }}>
          Mint shares
        </button>
      </div>
    </Modal>
  );
};

export default ProposalActionModal;

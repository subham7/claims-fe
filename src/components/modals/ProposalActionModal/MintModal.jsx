import Modal from "@components/common/Modal/Modal";
import classes from "./ProposalActionModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineFileUpload } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { getPublicClient } from "utils/viemConfig";
import { getAddress } from "viem";
import { normalize } from "viem/ens";

const MintModal = ({ setShowMintModal }) => {
  const [data, setData] = useState("");
  const dispatch = useDispatch();
  const publicClient = getPublicClient("0x1");
  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const resolveEns = async (ens) => {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(ens),
    });
    return ensAddress;
  };

  const validateInput = async (input) => {
    const lines = input.split("\n");
    const regex = /^[a-zA-Z0-9_.-]+, ?\d+(\.\d+)?$/;

    for (let line of lines) {
      if (!regex.test(line.trim())) {
        return false;
      }

      const [addressOrEns, amount] = line
        .trim()
        .split(",")
        .map((s) => s.trim());

      if (addressOrEns.endsWith(".eth")) {
        const address = await resolveEns(addressOrEns);
        if (!address) {
          return false;
        }
      } else {
        try {
          const address = getAddress(addressOrEns);
          if (!address) {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
    }

    return true;
  };

  const normalizeData = async (input) => {
    const lines = input.split("\n");
    const convertedLines = await Promise.all(
      lines.map(async (line) => {
        const [addressOrEns, amount] = line
          .trim()
          .split(",")
          .map((s) => s.trim());

        if (addressOrEns.endsWith(".eth")) {
          const resolvedAddress = await resolveEns(addressOrEns);
          if (resolvedAddress) {
            return `${resolvedAddress}, ${amount}`;
          }
        }
        return line;
      }),
    );

    return convertedLines.filter((line) => line !== null).join("\n");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (validateInput(lines.join("\n"))) {
          setData(lines.join("\n"));
        } else {
          dispatchAlert("Data format is not valid", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal className={classes.modal}>
      <div className={classes.title}>
        <h2
          style={{
            fontSize: "1.85rem",
            fontWeight: "600",
          }}>
          Mint shares
        </h2>
        <button
          className={classes.closeButton}
          onClick={() => {
            setShowMintModal(false);
          }}>
          <RxCross2 size={25} />
        </button>
      </div>
      <div className={classes.inputContainer}>
        <p
          style={{
            color: "#fff",
            fontWeight: "600",
          }}>
          Mint xDEGEN to users:
        </p>
        <textarea
          placeholder="Paste address or ENS, Amount"
          value={data}
          onChange={(event) => {
            setData(event.target.value);
          }}
        />
        <button className={classes.uploadButton}>
          <div className={classes.label}>
            <MdOutlineFileUpload size={20} /> Bulk Upload CSV
          </div>
          <input
            className={classes.uploadInput}
            name="upload"
            type="file"
            onChange={handleFileUpload}
            accept=".csv"
          />
        </button>
        <Link className={classes.link} href="">
          Download sample CSV file
        </Link>
      </div>
      <div className={classes.buttonContainer}>
        <button
          onClick={() => {
            setShowMintModal(false);
          }}
          className={classes.cancel}>
          Cancel
        </button>
        <button
          onClick={async () => {
            if (data) {
              if (await validateInput(data)) {
                const normalizedData = await normalizeData(data);
                console.log(normalizedData);
              } else {
                dispatchAlert("Data format is not valid", "error");
              }
            } else {
              dispatchAlert("Data is required", "error");
            }
          }}
          className={classes.mint}>
          Mint
        </button>
      </div>
    </Modal>
  );
};

export default MintModal;

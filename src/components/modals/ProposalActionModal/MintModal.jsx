import Modal from "@components/common/Modal/Modal";
import classes from "./ProposalActionModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineFileUpload } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import {
  fetchLatestBlockNumber,
  generateAlertData,
} from "utils/globalFunctions";
import { getPublicClient } from "utils/viemConfig";
import { getAddress } from "viem";
import { normalize } from "viem/ens";
import { useFormik } from "formik";
import { createProposal } from "api/proposal";
import { handleSignMessage } from "utils/helper";
import { useAccount, useSignMessage } from "wagmi";
import { mintValidationSchema } from "@components/createClubComps/ValidationSchemas";

const MintModal = ({ daoAddress, networkId, onActionComplete, onClose }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { address: walletAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
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
    const mintAddresses = [];
    const mintAmounts = [];
    let totalAmount = 0;

    await Promise.all(
      lines.map(async (line) => {
        const [addressOrEns, amount] = line
          .trim()
          .split(",")
          .map((s) => s.trim());

        let resolvedAddress = addressOrEns;

        if (addressOrEns.endsWith(".eth")) {
          resolvedAddress = await resolveEns(addressOrEns);
        }

        mintAddresses.push(resolvedAddress);
        const amountNumber = parseFloat(amount);
        mintAmounts.push(amountNumber);
        totalAmount += amountNumber;
      }),
    );

    return { mintAddresses, mintAmounts, totalAmount };
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

  const formik = useFormik({
    initialValues: {
      mintGTAddresses: [],
      mintGTAmounts: [],
    },
    validationSchema: mintValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const { mintAddresses, mintAmounts, totalAmount } = await normalizeData(
          data,
        );

        let commands = {
          mintGTAddresses: mintAddresses,
          mintGTAmounts: mintAmounts,
        };
        commands = {
          executionId: 1,
          ...commands,
        };

        const blockNum = await fetchLatestBlockNumber();

        const payload = {
          clubId: daoAddress,
          name: `Mint Total Amount: ${totalAmount}`,
          createdBy: walletAddress,
          commands: [commands],
          type: "action",
          daoAddress: daoAddress,
          block: blockNum,
          networkId: networkId,
        };

        const { signature } = await handleSignMessage(
          JSON.stringify(payload),
          signMessageAsync,
        );

        const request = await createProposal(isGovernanceActive, {
          ...payload,
          description: values.note ?? "",
          signature: signature,
        });

        setLoading(false);
        onActionComplete("success", request.data?.proposalId);
        onClose();
      } catch (error) {
        setLoading(false);
        onActionComplete("failure");
      }
    },
  });

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
        <button className={classes.closeButton} onClick={onClose()}>
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
        <button onClick={onClose()} className={classes.cancel}>
          Cancel
        </button>
        <button
          onClick={async () => {
            if (data) {
              if (await validateInput(data)) {
                formik.handleSubmit();
              } else {
                dispatchAlert("Data format is not valid", "error");
              }
            } else {
              dispatchAlert("Data is required", "error");
            }
          }}
          className={classes.mint}
          disabled={loading}>
          Mint
        </button>
      </div>
    </Modal>
  );
};

export default MintModal;

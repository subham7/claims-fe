/* eslint-disable react-hooks/exhaustive-deps */
import Modal from "@components/common/Modal/Modal";
import classes from "./ProposalActionModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineFileUpload } from "react-icons/md";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  fetchLatestBlockNumber,
  generateAlertData,
} from "utils/globalFunctions";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { createProposal } from "api/proposal";
import {
  csvToObjectForMintGT,
  ensToWalletAddress,
  handleSignMessage,
} from "utils/helper";
import { debounce } from "lodash";
import { useAccount, useSignMessage } from "wagmi";
import { mintValidationSchema } from "@components/createClubComps/ValidationSchemas";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch } from "react-redux";

const MintModal = ({
  daoAddress,
  networkId,
  onActionComplete,
  onClose,
  isGovernanceActive,
  tokenType,
}) => {
  const [data, setData] = useState("");
  const [isMintloading, setIsMintLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { address: walletAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const getTotalAmount = async (input) => {
    const lines = input.split("\n");
    let totalAmount = 0;

    await Promise.all(
      lines.map(async (line) => {
        const [addressOrEns, amount] = line
          .trim()
          .split(",")
          .map((s) => s.trim());

        const amountNumber = parseFloat(amount);
        totalAmount += amountNumber;
      }),
    );

    return totalAmount;
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setIsLoading(true);
        const data = event.target.result;
        setData(data);
        try {
          const { addresses, amounts } = csvToObjectForMintGT(data);
          const ensToWalletAddresses = await Promise.all(
            addresses.map(async (address) => {
              return await ensToWalletAddress(address);
            }),
          );

          formik.values.mintGTAmounts = amounts;
          formik.values.mintGTAddresses = ensToWalletAddresses;
          setIsLoading(false);
        } catch {
          setIsLoading(false);
          dispatchAlert("Invalid data format. Please add valid data.", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleInput = async (data) => {
    setIsLoading(true);
    try {
      const { addresses, amounts } = csvToObjectForMintGT(data);
      const ensToWalletAddresses = await Promise.all(
        addresses.map(async (address) => {
          return await ensToWalletAddress(address);
        }),
      );

      formik.values.mintGTAmounts = amounts;
      formik.values.mintGTAddresses = ensToWalletAddresses;
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      dispatchAlert("Invalid data format. Please enter valid data.", "error");
    }
  };

  const debouncedHandleInput = useCallback(debounce(handleInput, 500), []);

  const formik = useFormik({
    initialValues: {
      mintGTAddresses: [],
      mintGTAmounts: [],
    },
    validationSchema: mintValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsMintLoading(true);

        const totalAmount = await getTotalAmount(data);

        let commands = {
          mintGTAddresses: values.mintGTAddresses,
          mintGTAmounts: values.mintGTAmounts,
        };
        commands = {
          executionId: 1,
          ...commands,
        };

        const blockNum = await fetchLatestBlockNumber(networkId);

        const payload = {
          clubId: daoAddress,
          name: `Mint Total Amount` + totalAmount,
          createdBy: walletAddress,
          votingDuration: dayjs().add(100, "year").unix(),
          votingOptions: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
          commands: [commands],
          type: "action",
          tokenType,
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
          description: "",
          signature: signature,
        });

        setIsMintLoading(false);
        onActionComplete("success", request.data?.proposalId);
        onClose();
      } catch (error) {
        setIsMintLoading(false);
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
        <button className={classes.closeButton} onClick={onClose}>
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
            debouncedHandleInput(event.target.value);
          }}
        />
        {Boolean(
          formik.errors.mintGTAddresses || formik.errors.mintGTAmounts,
        ) && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
            }}>
            {(formik.touched.mintGTAddresses &&
              formik.errors.mintGTAddresses) ||
              (formik.touched.mintGTAmounts && formik.errors.mintGTAmounts)}
          </p>
        )}
        <button className={classes.uploadButton}>
          <div className={classes.label}>
            <MdOutlineFileUpload size={20} /> Bulk Upload CSV
          </div>
          <input
            className={classes.uploadInput}
            name="upload"
            type="file"
            onChange={handleChange}
            accept=".csv"
          />
        </button>
        <Link className={classes.link} href="/assets/csv/sample.csv">
          Download sample CSV file
        </Link>
      </div>
      <div className={classes.buttonContainer}>
        <button onClick={onClose} className={classes.cancel}>
          Cancel
        </button>
        <button
          type="submit"
          onClick={formik.handleSubmit}
          className={classes.mint}
          disabled={isMintloading || isLoading}>
          {isMintloading ? "Minting..." : isLoading ? "Validating..." : "Mint"}
        </button>
      </div>
    </Modal>
  );
};

export default MintModal;

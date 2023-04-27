import * as yup from "yup";

export const step1ValidationSchema = yup.object({
  clubName: yup
    .string("Enter club name")
    .min(2, "Name should be of minimum 2 characters length")
    .required("Club Name is required"),
  clubSymbol: yup
    .string("Enter club symbol")
    .required("Club Symbol is required"),
});

export const ERC20Step2ValidationSchema = yup.object({
  depositClose: yup.date().required("deposit close date is required"),
  minDepositPerUser: yup.number().required("min deposit amount is required"),
  maxDepositPerUser: yup
    .number()
    .moreThan(
      yup.ref("minDepositPerUser"),
      "Amount should be greater than min deposit",
    )
    .required("min deposit amount is required"),
  totalRaiseAmount: yup.number().required("raise amount is required"),
  pricePerToken: yup.number().required("price per token is required"),
});

export const step3ValidationSchema = yup.object({
  addressList: yup.array().of(
    yup
      .string()
      .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
      .required("wallet address is required"),
  ),
});

export const ERC721Step2ValidationSchema = yup.object({
  nftImage: yup.mixed().required("File is required"),
  pricePerToken: yup.number().required("price per token is required"),
  maxTokensPerUser: yup
    .number()
    .required("max token min limit per user is required"),
  isNftTotalSupplylimited: yup.boolean(),
  totalTokenSupply: yup.number().when("isNftTotalSupplylimited", {
    is: true,
    then: () => yup.number().required("total supply of nft is required"),
  }),
  depositClose: yup.date().required("deposit close date is required"),
});

export const proposalValidationSchema = yup.object({
  proposalDeadline: yup.date().required("deposit close date is required"),
  proposalTitle: yup
    .string("Enter proposal title")
    .required("Title is required"),
  proposalDescription: yup
    .string("Enter proposal description")
    .required("Description is required"),
  optionList: yup.array().of(
    yup.object({
      text: yup.string().required("option is required"),
    }),
  ),
  actionCommand: yup.string("Enter proposal action").when("typeOfProposal", {
    is: "action",
    then: () =>
      yup
        .string("Enter proposal action")
        .required("action command is required"),
  }),
  userAddress: yup
    .string("Please enter user address")

    .when("actionCommand", {
      is: "Mint club token",
      then: () =>
        yup
          .string("Enter user address")
          .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
          .required("User address is required"),
    }),
  amountOfTokens: yup.number("Enter amount of tokens").when("actionCommand", {
    is: "Mint club token",
    then: () =>
      yup
        .number("Enter amount of tokens")
        .required("Amount is required")
        .moreThan(0, "Amount should be greater than 0"),
  }),
  quorum: yup.number("Enter Quorum in percentage").when("actionCommand", {
    is: "Update Governance Settings",
    then: () =>
      yup
        .number("Enter Quorum in percentage")
        .required("Quorum is required")
        .moreThan(0, "Quorum should be greater than 0")
        .max(100, "Quorum should be less than 100"),
  }),
  threshold: yup.number("Enter Threshold in percentage").when("actionCommand", {
    is: "Update Governance Settings",
    then: () =>
      yup
        .number("Enter Threshold in percentage")
        .required("Threshold is required")
        .moreThan(0, "Threshold should be greater than 0")
        .max(100, "Threshold should be less than 100"),
  }),
  totalDeposit: yup.number("Enter total deposit amount").when("actionCommand", {
    is: "Change total raise amount",
    then: () =>
      yup
        .number("Enter total deposit amount")
        .required("Total deposit is required")
        .moreThan(0, "Total deposit should be greater than 0"),
  }),
  recieverAddress: yup
    .string("Please enter reciever address")
    .when("actionCommand", {
      is: "Send token to an address",
      then: () =>
        yup
          .string("Enter reciever address")
          .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
          .required("Reciever address is required"),
    }),
  amountToSend: yup.number("Enter amount to be sent").when("actionCommand", {
    is: "Send token to an address",
    then: () =>
      yup
        .number("Enter amount to be sent")
        .required("Amount is required")
        .moreThan(0, "Amount should be greater than 0"),
  }),
});

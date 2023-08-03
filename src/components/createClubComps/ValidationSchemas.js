import * as yup from "yup";

export const step1ValidationSchema = yup.object({
  clubName: yup
    .string("Enter club name")
    .min(2, "Name should be of minimum 2 characters length")
    .required("Club Name is required"),
  clubSymbol: yup
    .string("Enter club symbol")
    .required("Club Symbol is required"),
  email: yup.string("Enter email address").email("Enter valid email"),
});

export const ERC20Step2ValidationSchema = yup.object({
  depositClose: yup
    .date()
    .min(new Date(), "Date-time must be greater than now.")
    .required("Deposit close date is required"),
  minDepositPerUser: yup
    .number()
    .required("Min deposit amount is required")
    .moreThan(0, "Min deposit should be greater than 0"),
  maxDepositPerUser: yup
    .number()
    .moreThan(
      yup.ref("minDepositPerUser"),
      "Amount should be greater than min deposit",
    )
    .required("Max deposit amount is required"),
  totalRaiseAmount: yup
    .number()
    .required("Raise amount is required")
    .moreThan(
      yup.ref("minDepositPerUser"),
      "Amount should be greater than min deposit",
    ),
  pricePerToken: yup
    .number()
    .required("Price per token is required")
    .moreThan(0, "Price should be greater than 0"),
});

export const step3ValidationSchema = yup.object({
  addressList: yup
    .array()
    .of(
      yup
        .string()
        .test("Address", "Invalid address", (value) => {
          return value && value.length === 42 && value.startsWith("0x");
        })
        .required("Wallet address is required"),
    )
    .test("Duplicate address", "Duplicate address found", function (value) {
      if (value) {
        const uniqueSet = new Set(value);
        const isUnique = uniqueSet.size === value.length;

        if (!isUnique) {
          const duplicates = [];
          value.forEach((address, index) => {
            if (value.indexOf(address) !== index) {
              duplicates.push(index);
            }
          });

          return this.createError({
            path: `addressList[${duplicates[0]}]`,
            message: "Duplicate address found",
          });
        }
      }

      return true;
    }),
});

export const step4ValidationSchema = yup.object({
  deploySafe: yup.boolean(),
  safeAddress: yup.string().when("deploySafe", {
    is: false,
    then: () =>
      yup.string("Enter safe address").required("Safe address is required"),
  }),
});

export const ERC721Step2ValidationSchema = yup.object({
  nftImage: yup.mixed().required("File is required"),
  pricePerToken: yup.number().required("Price per token is required"),
  maxTokensPerUser: yup
    .number()
    .required("Max token min limit per user is required"),
  isNftTotalSupplylimited: yup.boolean(),
  totalTokenSupply: yup.number().when("isNftTotalSupplylimited", {
    is: true,
    then: () => yup.number().required("Total supply of nft is required"),
  }),
  depositClose: yup
    .date()
    .min(new Date(), "Date-time must be greater than now.")
    .required("Deposit close date is required"),
});

export const proposalValidationSchema = yup.object({
  proposalDeadline: yup.date().required("Deposit close date is required"),
  proposalTitle: yup
    .string("Enter proposal title")
    .required("Title is required"),
  proposalDescription: yup
    .string("Enter proposal description")
    .required("Description is required"),
  optionList: yup.array().of(
    yup.object({
      text: yup.string().required("Option is required"),
    }),
  ),
  actionCommand: yup.string("Enter proposal action").when("typeOfProposal", {
    is: "action",
    then: () =>
      yup
        .string("Enter proposal action")
        .required("Action command is required"),
  }),
  amountToAirdrop: yup.number("Enter amount of tokens").when("actionCommand", {
    is: "Distribute token to members",
    then: () =>
      yup
        .number("Enter amount of tokens")
        .required("Amount is required")
        .moreThan(0, "Amount should be greater than 0"),
  }),
  userAddress: yup.string("Please enter user address").when("actionCommand", {
    is: "Mint club token",
    then: () =>
      yup
        .string("Enter user address")
        .matches(/^0x[a-zA-Z0-9]+/gm, " Proper wallet address is required")
        .required("User address is required"),
  }),
  amountOfTokens: yup.number().when(["tokenType", "actionCommand"], {
    is: (tokenType, actionCommand) =>
      tokenType === "erc20" && actionCommand === "Mint Club Token",
    then: yup
      .number()
      .required("Amount is required")
      .moreThan(0, "Amount should be greater than 0"),
  }),
  amountOfTokens721: yup.number().when(["tokenType", "actionCommand"], {
    is: (tokenType, actionCommand) =>
      tokenType === "erc721" && actionCommand === "Mint Club Token",
    then: yup
      .number()
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
  lensId: yup.string("Please enter lens id").when("actionCommand", {
    is: "whitelist with lens followers",
    then: () =>
      yup.string("Enter lens profile id").required("Lens id is required"),
  }),
  recieverAddress: yup
    .string("Please enter reciever address")
    .when("actionCommand", {
      is: "Send token to an address",
      then: () =>
        yup
          .string("Enter reciever address")
          .matches(/^0x[a-zA-Z0-9]+/gm, " Proper wallet address is required")
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
  safeThreshold: yup
    .number("Enter threshold")
    .when(["actionCommand", "ownerChangeAction"], {
      is: (actionCommand, ownerChangeAction) =>
        actionCommand === "Add/remove owners" && ownerChangeAction === "remove",
      then: () =>
        yup
          .number("Enter threshold")
          .required("Safe Threshold is required")
          .moreThan(1, "Safe Threshold should be greater than 1"),
    }),
});

export const claimStep1ValidationSchema = yup.object({
  description: yup
    .string("Enter one-liner description")
    .required("description is required"),
  numberOfTokens: yup
    .number()
    .required("Enter amount of tokens")
    .moreThan(0, "Amount should be greater than 0"),
  startDate: yup.date().required("start date is required"),
  endDate: yup
    .date()
    .required("end date is required")
    .min(yup.ref("startDate")),
  selectedToken: yup.object({}).required("Token is required"),
});

export const claimStep2ValidationSchema = yup.object({
  daoTokenAddress: yup
    .string("Enter dao address")
    .notRequired()
    .when("eligible", {
      is: "token",
      then: () => yup.string().required("Enter token address"),
    }),
  tokenGatingAmt: yup
    .string("Enter token gating amount")
    .notRequired()
    .when("eligible", {
      is: "token",
      then: () => yup.string().required("Enter token gating amount"),
    }),
  // .required("Dao token is required"),
  customAmount: yup
    .number("Enter custom Amount")
    .notRequired()
    .when("maximumClaim", {
      is: "custom",
      then: () =>
        yup
          .number("Enter custom Amount")
          // .required("Please enter custom amount")
          .moreThan(0, "Amount should be greater than 0"),
      // .lessThan(yup.ref("numberOfTokens")),
    }),
});

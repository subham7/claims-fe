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

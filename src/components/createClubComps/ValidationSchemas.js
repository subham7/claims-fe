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
    then: yup.number().required("total supply of nft is required"),
  }),
  depositClose: yup.date().required("deposit close date is required"),
});

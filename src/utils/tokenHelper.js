import { CHAIN_CONFIG } from "./constants";

export const getTokenSymbolFromAddress = (props) => {
  const { usdcAddress, nativeToken, usdtAddress } =
    CHAIN_CONFIG[props.networkId];
  const { depositToken } = props.formik.values;

  if (depositToken === usdcAddress) {
    return "USDC";
  } else if (depositToken === nativeToken) {
    return CHAIN_CONFIG[props.networkId].nativeCurrency.name;
  } else if (depositToken === usdtAddress) {
    return "USDT";
  }
  return "";
};

export const getTokenImageFromAddress = ({ tokenAddress, networkId }) => {
  const { usdcAddress, nativeToken, usdtAddress } = CHAIN_CONFIG[networkId];

  if (tokenAddress?.toLowerCase() === usdcAddress?.toLowerCase()) {
    return "/assets/icons/usd.png";
  } else if (tokenAddress?.toLowerCase() === usdtAddress?.toLowerCase()) {
    return "/assets/icons/usdt.png";
  } else if (tokenAddress?.toLowerCase() === nativeToken?.toLowerCase()) {
    return CHAIN_CONFIG[networkId]?.nativeCurrency?.image;
  } else {
    return "";
  }
};

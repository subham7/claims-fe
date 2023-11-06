export const proposalType = [
  {
    type: "Survey",
    name: "Survey",
  },
  {
    type: "Action",
    name: "Action",
  },
];

const today = new Date();
export const votingDuration = [
  {
    text: "1 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
  },
  {
    text: "2 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
  },
  {
    text: "3 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
  },
  {
    text: "4 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
  },
  {
    text: "5 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
  },
  {
    text: "6 days",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
  },
];

export const proposalDisplayOptions = [
  {
    type: "all",
    name: "All",
  },
  {
    type: "active",
    name: "Active",
  },
  {
    type: "passed",
    name: "Passed",
  },
  {
    type: "executed",
    name: "Executed",
  },
  {
    type: "failed",
    name: "Failed",
  },
];

export const nfts = [
  {
    id: "1",
    imgSrc: "/assets/NFT_IMAGES/1.png",
  },
  {
    id: "2",
    imgSrc: "/assets/NFT_IMAGES/2.png",
  },
  {
    id: "3",
    imgSrc: "/assets/NFT_IMAGES/3.png",
  },
  {
    id: "4",
    imgSrc: "/assets/NFT_IMAGES/4.png",
  },
  {
    id: "5",
    imgSrc: "/assets/NFT_IMAGES/5.png",
  },
  {
    id: "6",
    imgSrc: "/assets/NFT_IMAGES/6.png",
  },
  {
    id: "7",
    imgSrc: "/assets/NFT_IMAGES/7.png",
  },
];

export const tableHeader = ["Name", "Holding", "Value in USD"];

export const tableData = [
  {
    tokenName: "USDC (PoS token)",
    price: "$4,343",
    holding: "0.32",
    value: "$23",
    symbol: "USDC",
    imgUrl: "/assets/icons/usd.png",
  },
  {
    tokenName: "Matic (PoS token)",
    price: "$4,343",
    holding: "0.32",
    value: "$23",
    symbol: "Matic",
    imgUrl: "/assets/icons/usd.png",
  },
];

export const dummyProposals = [
  {
    id: "1",
    title: "Proposal 1 (Voting) Proposal 1 (Voting)",
    date: "3 days ago",
  },
  {
    id: "2",
    title: "Proposal 1 (Not Voting)",
    date: "3 days ago",
  },
  {
    id: "3",
    title: "Proposal 1",
    date: "3 days ago",
  },
  {
    id: "4",
    title: "Proposal 1",
    date: "3 days ago",
  },
  {
    id: "5",
    title: "Proposal 1",
    date: "3 days ago",
  },
];

export const dummyTransactions = [
  {
    id: "1",
    tokenName: "USDC",
    amount: "0.32",
    type: "Send",
  },
  {
    id: "2",
    tokenName: "USDC",
    amount: "0.32",
    type: "Deposit",
  },
  {
    id: "3",
    tokenName: "USDC",
    amount: "0.32",
    type: "Send",
  },
  {
    id: "1",
    tokenName: "USDC",
    amount: "0.32",
    type: "Deposit",
  },
  {
    id: "2",
    tokenName: "USDC",
    amount: "0.32",
    type: "Deposit",
  },
  {
    id: "3",
    tokenName: "USDC",
    amount: "0.32",
    type: "Deposit",
  },
];

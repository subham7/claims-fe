export const tokenType = [
  "Non Transferable ERC20 Token",
  // "Transferable ERC20 Token (Coming soon!)",
  "NFT",
  // "Custom ERC20 Token (Coming soon!)",
];

export const useStationForType = [
  "Investment Club/Syndicate",
  "Fund management",
  "Nft memberships",
  "Charity/Impact funding",
  "Manage grants",
  "Others",
];

const today = new Date();
export const dateTill = [
  {
    text: "1 Week starting from today",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
  },
  {
    text: "2 Week starting from today",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
  },
  {
    text: "1 month starting from today",
    date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
  },
];

export const exitDates = [
  {
    text: "After 1 week",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
  },
  {
    text: "After 1 month",
    date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
  },
  {
    text: "After 3 month",
    date: new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()),
  },
  {
    text: "After 6 month",
    date: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()),
  },
  {
    text: "After 1 year",
    date: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  },
];

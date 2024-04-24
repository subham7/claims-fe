import { CHAIN_CONFIG } from "utils/constants";

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

export const baseLinks = (routeNetworkId) => [
  { icon: "home_icon", title: "Dashboard", routeHeader: "dashboard" },
  { icon: "workflows_icon", title: "Activity", routeHeader: "proposals" },
  {
    icon: "stats",
    title: "Transactions",
    routeHeader: "transactions",
  },
  {
    icon: "Wallet_icon",
    title: "Staking",
    routeHeader: "staking",
    hideNetworks: ["0x89", "0xa86a"],
  },
  {
    icon: CHAIN_CONFIG[routeNetworkId]?.theme?.members_icon,
    title: "Members",
    routeHeader: "members",
  },
  // { icon: "document_icon", title: "Documents", routeHeader: "documents" },
  { icon: "settings_icon", title: "Settings", routeHeader: "settings" },
];

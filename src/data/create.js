export const contractList = [
  {
    contractHeading: "Invest together",
    contractSubHeading:
      "For friends, colleagues, investment DAOs, syndicates, funds, VCs & communities of any size.",
    image: "/assets/images/investments_illustration.svg",
    star: false,
    inactive: false,
    backgroundColour: "#A0FFE6",
    comingSoonEnabled: false,
  },
  {
    contractHeading: "Manage Grants ",
    contractSubHeading:
      "Give grants to ideas that matter - for protocols, accelerators, teams, foundations & more",
    image: "/assets/images/grants_illustration.svg",
    star: false,
    inactive: true,
    backgroundColour: "#FFFFDD",
    comingSoonEnabled: true,
  },
  {
    contractHeading: "NFT DAO Treasury ",
    contractSubHeading:
      "Empower your NFT community in your roadmap - for creators, artists, NFT projects, crowdfunding",
    image: "/assets/images/treasury_illustration.svg",
    star: false,
    inactive: true,
    backgroundColour: "#81F5FF",
    comingSoonEnabled: true,
  },
  {
    contractHeading: "NFT Collectors ",
    contractSubHeading:
      "Start your own party DAO, collect NFTs, art & everything rare, as a club - for NFT enthusiasts, artists, collectors & more.",
    image: "/assets/images/collectors_illustration.svg",
    star: false,
    inactive: true,
    backgroundColour: "#C9CBFF",
    comingSoonEnabled: true,
  },
  {
    contractHeading: "Impact DAOs ",
    contractSubHeading:
      "Work together towards causes close to your heart - for charities, crowdfunding, NGOs, philanthropists & more.",
    image: "/assets/images/charity_illustration.svg",
    star: false,
    inactive: true,
    backgroundColour: "#FFD5E5",
    comingSoonEnabled: true,
  },
  {
    contractHeading: "Social DAOs ",
    contractSubHeading:
      "Empower people sharing common interests to do meet-ups, events & interact socially",
    image: "/assets/images/party_illustration.svg",
    star: false,
    inactive: true,
    backgroundColour: "#FFFFDD",
    comingSoonEnabled: true,
  },
  {
    contractHeading: "Create custom ",
    contractSubHeading:
      "Choose custom parameters to create a club with other goals",
    image: "/assets/images/custom_illustration.svg",
    star: true,
    inactive: true,
    backgroundColour: "#81F5FF",
    comingSoonEnabled: true,
  },
];

export const tokenType = [
  "Non Transferable ERC20 Token",
  // "Transferable ERC20 Token (Coming soon!)",
  "NFT",
  // "Custom ERC20 Token (Coming soon!)",
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

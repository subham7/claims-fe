export const THEME_CONFIG = (networkId) => {
  switch (networkId) {
    case "0x138d4":
      return {
        background:
          "linear-gradient(95.07deg, #424951 0%, #DE4D00 48.5%, #FFA901 100%)",
        metamask_icon: "/assets/icons/bear.png",
        members_icon: "bear_icon",
        stationType: "berastation",
      };

    default:
      return {
        background:
          "transparent linear-gradient(238deg, #2E55FF 0%, #FF279C 100%) 0% 0% no-repeat padding-box",
        members_icon: "astronaut_icon",
        stationType: "station",
      };
  }
};

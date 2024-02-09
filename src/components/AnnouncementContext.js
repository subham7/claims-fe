import React, { createContext, useState } from "react";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  const openAnnouncement = () => {
    setShowAnnouncement(true);
  };

  return (
    <AnnouncementContext.Provider
      value={{ showAnnouncement, closeAnnouncement, openAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

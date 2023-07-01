import React, { createContext, useState } from "react";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  return (
    <AnnouncementContext.Provider
      value={{ showAnnouncement, closeAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

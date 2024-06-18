import Navbar from "@components/ui/Navbar/Navbar";
import React from "react";
import Spaces from "@components/(spaces)/Spaces";
import Footer from "@components/(spaces)/Footer";

const SpacesPage = () => {
  return (
    <div>
      <Navbar />
      <Spaces />
      <Footer />
    </div>
  );
};

export default SpacesPage;

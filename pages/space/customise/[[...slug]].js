import Customise from "@components/(spaces)/Customise";
import Footer from "@components/(spaces)/Footer";
import Navbar from "@components/ui/Navbar/Navbar";
import { useRouter } from "next/router";

const Space = () => {
  const router = useRouter();
  const [spaceId] = router?.query?.slug ?? [];

  return (
    <div>
      <Navbar />
      <Customise spaceId={spaceId} />
      <Footer />
    </div>
  );
};

export default Space;

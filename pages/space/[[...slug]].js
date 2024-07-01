import Footer from "@components/(spaces)/Footer";
import Spaces from "@components/(spaces)/Spaces";
import Navbar from "@components/ui/Navbar/Navbar";
import { useRouter } from "next/router";

const Space = () => {
  const router = useRouter();
  const [spaceId] = router?.query?.slug ?? [];

  return (
    <div>
      <Navbar />
      <Spaces spaceId={spaceId} />
      <Footer />
    </div>
  );
};

export default Space;

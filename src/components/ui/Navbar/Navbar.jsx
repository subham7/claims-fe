import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={classes.nav}>
      <Image
        src="/assets/images/monogram.png"
        height="40"
        width="40"
        alt="monogram"
        onClick={() => {
          router.push("/");
        }}
      />
      <div className={classes["wallet-div"]}>
        <w3m-button />
      </div>
    </nav>
  );
};

export default Navbar;

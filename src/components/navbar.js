import { React } from "react";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar">
      <Link href={"/"}>
        <Image
          src="/assets/images/monogram.png"
          height="40"
          width="40"
          alt="monogram"
        />
      </Link>
      <div className="wallet-div">
        <Web3NetworkSwitch />
        <Web3Button className="web3-button" />
      </div>
    </div>
  );
}

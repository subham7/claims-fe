import { React } from "react";
import { Web3Button } from "@web3modal/react";
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
      <Web3Button className="web3-button" />
    </div>
  );
}

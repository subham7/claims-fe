import React from "react";
import { Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

function LinkTab(props) {
  const { label, href } = props;
  return (
    <Link href={href}>
      <Tab label={label} />
    </Link>
  );
}

export default function NavTabs(props) {
  const { data, linkedTabs } = props;
  const router = useRouter();
  let index = data.findIndex((item) => item.href === router.route);

  return (
    <>
      <Tabs value={index} onChange={() => {}} aria-label="nav tabs">
        {data.map((item, key) => (
          <LinkTab key={key} label={item.label} href={item.href} />
        ))}
      </Tabs>
    </>
  );
}

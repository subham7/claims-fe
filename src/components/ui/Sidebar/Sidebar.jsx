import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { getLinks } from "utils/helper";
import IconLink from "./IconLink";
import classes from "./Sidebar.module.scss";
import Image from "next/image";

const Sidebar = ({ daoAddress, networkId }) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const router = useRouter();

  const links = useMemo(
    () => getLinks(daoAddress, networkId),
    [daoAddress, networkId],
  );

  const handleMouseEnter = useCallback((id) => {
    setHoveredLink(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
  }, []);

  const routeHandler = useCallback(
    (route) => {
      router.push(route);
    },
    [router],
  );

  const activeRouteHeader = useMemo(() => {
    const match = router.pathname.match(/\/(\w+)/);
    return match ? match[1] : "";
  }, [router.pathname]);

  return (
    <div className={classes.sidebar}>
      <div className={classes.iconsList}>
        <Image
          src="/assets/images/logo.png"
          height="28"
          width="28"
          alt="veridrop"
          style={{
            marginBottom: "20px",
          }}
          onClick={() => {
            router.push("/");
          }}
        />
        {links.map((link) => (
          <IconLink
            key={link.id}
            link={link}
            isActive={
              hoveredLink === link.id || activeRouteHeader === link.routeHeader
            }
            onEnter={() => handleMouseEnter(link.id)}
            onLeave={handleMouseLeave}
            onClick={() => routeHandler(link.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

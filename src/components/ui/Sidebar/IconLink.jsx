import { Tooltip } from "@mui/material";
import Image from "next/image";
import classes from "./Sidebar.module.scss";

const IconLink = ({ link, isActive, onEnter, onLeave, onClick }) => {
  const { title, icon, hoveredLink } = link;
  return (
    <Tooltip placement="right" title={title}>
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        className={classes.link}>
        <Image
          src={isActive ? hoveredLink : icon}
          height={16}
          width={16}
          alt={title}
        />
      </div>
    </Tooltip>
  );
};

export default IconLink;

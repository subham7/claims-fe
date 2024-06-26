import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";

const CustomSkeleton = ({
  width,
  height,
  length,
  variant = "rectangular",
  marginTop = 0,
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {Array.from({ length: length }).map((_, index) => (
        <Skeleton
          animation="wave"
          variant={variant}
          key={index}
          width={width}
          height={height}
          sx={{
            marginTop: marginTop,
            bgcolor: "grey.900",
            borderRadius: "8px",
          }}
        />
      ))}
    </Box>
  );
};

export default CustomSkeleton;

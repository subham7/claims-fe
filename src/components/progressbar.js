import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 4,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    border: "1px solid #dcdcdc40",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    background:
      "transparent linear-gradient(270deg, #2D55FF 0%, #75D5FD 100%) 0% 0% no-repeat padding-box",
  },
}));

export default function ProgressBar(props) {
  return (
    <BorderLinearProgress
      sx={{
        zIndex: -1,
      }}
      variant="determinate"
      value={props.value}
    />
  );
}

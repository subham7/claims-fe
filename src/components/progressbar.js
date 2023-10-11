import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 4,
  [`&.${linearProgressClasses.colorPrimary}`]: {},
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 2,
    background: "#2D55FF",
  },
}));

export default function ProgressBar(props) {
  return (
    <BorderLinearProgress
      sx={{
        zIndex: props.zIndex ? props.zIndex : 0,
        background: "#707070",
      }}
      variant="determinate"
      value={props.value}
    />
  );
}

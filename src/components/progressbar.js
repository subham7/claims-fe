import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        border: "1px solid #C1D3FF40"
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
        background: "transparent linear-gradient(270deg, #3B7AFD 0%, #75D5FD 100%) 0% 0% no-repeat padding-box"
      // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));


export default function ProgressBar(props){ 
    return <BorderLinearProgress variant="determinate" value={props.value} />
}
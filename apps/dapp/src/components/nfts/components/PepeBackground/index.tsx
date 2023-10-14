import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const BackgroundBox = styled(Box)`
  background: radial-gradient(
    89.45% 27.82% at 70.13% 0%,
    rgba(20, 62, 253, 0.31) 0%,
    #282f43 0.01%,
    rgba(41, 49, 70, 0) 100%
  );
`;

export const BackgroundOverlay = styled(Box)`
  @media (min-width: 700px) {
    position: absolute;
    min-height: 100vh;
    width: 100%;
    opacity: 0.2;
    background: url('/assets/pepebg2.png');
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 0;
  }
`;

export const MobileBackgroundOverlay = styled(Box)`
  position: fixed;
  width: 100%;
  height: 1500px;
  left: 0px;
  bottom: 0px;
  z-index: 0;
  background: radial-gradient(
      89.45% 27.82% at 50.13% 0%,
      rgba(20, 62, 253, 0.31) 0%,
      #282f43 0.01%,
      rgba(41, 49, 70, 0) 100%
    ),
    url('/assets/pepebg2.png');
  background-position: bottom;
  background-size: 100vh;
  background-repeat: no-repeat;
  opacity: 0.5;

  @media (min-width: 700px) {
    display: none;
  }
`;

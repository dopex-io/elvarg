import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';

const PepeText = ({ text }: { text: string }) => {
  const StyledText = styled(Typography)`
    background: linear-gradient(to right, #ffffff 0%, #9cecfd 64.06%);
    background-image: linear-gradient(to right, #ffffff 0%, #9cecfd 64.06%);
    text-transform: uppercase;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    letter-spacing: 2px;
  `;

  return <StyledText variant="caption">{text}</StyledText>;
};

export default PepeText;

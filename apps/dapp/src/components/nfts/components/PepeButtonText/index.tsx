import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';

const PepeButtonText = ({ text }: { text: string }) => {
  const StyledText = styled(Typography)`
    font-family: Minecraft;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: white;
    flex: none;
    order: 2;
    flex-grow: 0;
    margin: 0px 8px;
    letter-spacing: 1px;
  `;

  return <StyledText variant="h5">{text}</StyledText>;
};

export default PepeButtonText;

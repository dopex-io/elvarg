import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';

const PepeButtonText = ({
  text,
  variant = 'caption',
}: {
  text: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption';
}) => {
  const StyledText = styled(Typography)`
    font-family: Minecraft;
    font-style: normal;
    font-weight: normal;
    line-height: 18px;
    text-align: center;
    color: white;
    flex: none;
    order: 2;
    flex-grow: 0;
    margin: 0px 8px;
    letter-spacing: 1px;
  `;

  return <StyledText variant={variant}>{text}</StyledText>;
};

export default PepeButtonText;

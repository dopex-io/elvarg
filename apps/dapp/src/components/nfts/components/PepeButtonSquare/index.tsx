import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import PepeButtonText from 'components/nfts/components/PepeButtonText';

const PepeButtonSquare = ({
  disabled = false,
  action,
  text,
  variant = 'caption',
}: {
  disabled: boolean;
  action: () => void;
  text: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption';
}) => {
  const StyledButton = styled(CustomButton)`
    cursor: pointer;
    background: #43609a !important;
    box-shadow: inset 2px 2px 0px #7193d6, inset -3px -3px 0px #213459;
    width: 40px;
    height: 40px;
    color: white;
    padding: 10px;
    font-family: Minecraft, serif;
    text-transform: uppercase;
    z-index: 50;
    position: relative;
  `;

  return (
    <StyledButton disabled={disabled} onClick={action}>
      <PepeButtonText text={text} variant={variant} />
    </StyledButton>
  );
};

export default PepeButtonSquare;

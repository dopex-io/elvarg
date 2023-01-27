import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import PepeButtonText from 'components/nfts/components/PepeButtonText';

const PepeButtonSquare = ({
  disabled,
  action,
  text,
}: {
  disabled: boolean;
  action: () => void;
  text: string;
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
      <PepeButtonText text={text} />
    </StyledButton>
  );
};

export default PepeButtonSquare;

import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import PepeButtonText from 'components/nfts/components/PepeButtonText';

const PepeButton = ({
  handleMint,
  text,
}: {
  handleMint: () => {};
  text: string;
}) => {
  const StyledButton = styled(CustomButton)`
    width: 100%;
    padding: 4px 8px;
    background: #43609a !important;
    box-shadow: inset 2px 2px 0px #3b5280, inset -3px -3px 0px #19243c;
    border: 0.6px solid black;
    border-radius: 0px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: 10px 0px;
  `;

  return (
    <StyledButton size="medium" onClick={handleMint}>
      <PepeButtonText text={text} />
    </StyledButton>
  );
};

export default PepeButton;

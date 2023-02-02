import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import PepeButtonText from 'components/nfts/components/PepeButtonText';

const PepeButton = ({
  action,
  text,
  className = '',
  variant = 'caption',
}: {
  action: (() => {}) | (() => void);
  text: string;
  className: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption';
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
    <StyledButton size="medium" onClick={action} className={className}>
      <PepeButtonText text={text} variant={variant} />
    </StyledButton>
  );
};

export default PepeButton;

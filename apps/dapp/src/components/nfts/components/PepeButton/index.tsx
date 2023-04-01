import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import PepeButtonText from 'components/nfts/components/PepeButtonText';

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

export const PepeChildrenButton = ({
  action,
  children,
  className = '',
  disabled = false,
}: {
  action: (() => {}) | (() => void);
  children: ReactNode;
  className: string;
  disabled: boolean;
}) => {
  return (
    <StyledButton
      size="medium"
      onClick={action}
      className={className}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export const PepeButton = ({
  action,
  text,
  className = '',
  variant = 'caption',
  disabled = false,
}: {
  action: (() => {}) | (() => void);
  text: string;
  className: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption';
  disabled: boolean;
}) => {
  return (
    <PepeChildrenButton
      action={action}
      className={className}
      disabled={disabled}
    >
      <PepeButtonText text={text} variant={variant} />
    </PepeChildrenButton>
  );
};

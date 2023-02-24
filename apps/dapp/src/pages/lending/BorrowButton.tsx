import { ReactNode } from 'react';
import { Button as CustomButton } from '@dopex-io/ui';

interface BorrowButtonProps {
  color?: any;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const BorrowButton = ({
  color = 'primary',
  disabled,
  onClick,
  children,
}: BorrowButtonProps) => {
  return (
    <CustomButton
      size="medium"
      className="w-full mt-4 !rounded-md"
      color={color}
      disabled={disabled!}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};

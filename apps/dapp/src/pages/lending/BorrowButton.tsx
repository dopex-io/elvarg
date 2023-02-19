import { ReactNode } from 'react';
import { CustomButton } from 'components/UI';

interface BorrowButtonProps {
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

function BorrowButton({
  color = 'primary',
  disabled,
  onClick,
  children,
}: BorrowButtonProps) {
  return (
    <CustomButton
      size="medium"
      className="w-full mt-4 !rounded-md"
      color={color}
      disabled={!disabled}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
}

export default BorrowButton;

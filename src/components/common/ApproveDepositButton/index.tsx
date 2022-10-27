import { CustomButton } from 'components/UI';
import { MouseEventHandler } from 'react';

interface Props {
  approved: boolean;
  fillButtonMessage: string;
  handleFillPosition: MouseEventHandler<HTMLButtonElement>;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  showPrimary: boolean;
}

const ApproveDepositButton = ({
  approved,
  fillButtonMessage,
  handleFillPosition,
  handleApprove,
  showPrimary,
}: Props) => {
  return (
    <CustomButton
      size="medium"
      className="w-full !rounded-md mt-3"
      color={showPrimary ? 'primary' : 'mineshaft'}
      disabled={!showPrimary}
      onClick={approved ? handleFillPosition : handleApprove}
    >
      {fillButtonMessage}
    </CustomButton>
  );
};

export default ApproveDepositButton;

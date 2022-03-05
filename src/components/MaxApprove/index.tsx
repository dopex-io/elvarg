import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import InfoPopover from 'components/UI/InfoPopover';

interface MaxApproveProps {
  value: boolean;
  setValue: Function;
}

const MaxApprove = ({ value, setValue }: MaxApproveProps) => {
  const handleChange = useCallback(
    () => setValue((c: boolean) => !c),
    [setValue]
  );

  return (
    <Box className="ml-1">
      <span></span>
      <InfoPopover
        id="max-approve-info"
        infoText="Preapprove the contract to be able to spend any amount of your tokens. You will not need to approve again, saving you on transaction fees in the future."
        triggerText="Max Approve"
      />
      <Switch
        className="mt-1"
        onChange={handleChange}
        value={value}
        color="primary"
      />
    </Box>
  );
};

export default MaxApprove;

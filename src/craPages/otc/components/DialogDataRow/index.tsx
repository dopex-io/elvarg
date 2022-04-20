import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface DialogDataRowProps {
  info: string;
  value: string;
}

const DialogDataRow = (props: DialogDataRowProps) => {
  const { info, value } = props;

  return (
    <Box className="flex justify-between">
      <Typography variant="h6" className="text-stieglitz">
        {info}
      </Typography>
      <Typography variant="h6" className="text-white">
        {value}
      </Typography>
    </Box>
  );
};

export default DialogDataRow;

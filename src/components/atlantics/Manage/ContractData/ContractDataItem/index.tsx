import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface ContractDataItemProps {
  description: string;
  value: string | React.ReactNode;
  variant: 'row' | 'col';
}

const ROOT_VARIANTS = {
  row: 'flex justify-between p-3',
  col: 'space-y-3 p-3',
};

const ContractDataItem = (props: ContractDataItemProps) => {
  const { description, value, variant } = props;

  return (
    <Box className={ROOT_VARIANTS[variant]}>
      <Typography variant="h6" color="stieglitz">
        {description}
      </Typography>
      {value}
    </Box>
  );
};

export default ContractDataItem;

import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import PerpetualPoolsIcon from 'svgs/icons/PerpetualPoolsIcon';

interface Props {
  title: string;
  subtitle: string;
}

const Title = (props: Props) => {
  const { title, subtitle } = props;

  return (
    <Box className="flex rounded-xl p-3 w-1/3 bg-cod-gray space-x-3">
      <PerpetualPoolsIcon className="my-auto" />
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h6" color="stieglitz">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default Title;

import c from 'classnames';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Equal from 'assets/icons/Equal';

interface StatBoxProps {
  Top: any;
  Bottom: any;
  data: any;
}
const StatBox = ({ Top, Bottom, data }: StatBoxProps) => {
  const { formik } = data;
  return (
    <Box className="flex flex-col">
      <Typography
        variant="h4"
        className={c(
          formik.values.amount > 0
            ? 'text-wave-blue flex flex-row items-center'
            : ''
        )}
      >
        <Equal
          className={c(
            formik.values.amount > 0 ? 'hidden mr-2' : 'hidden mr-2'
          )}
        />
        {Top}
      </Typography>
      <Box className="flex flex-row items-center">
        <Typography variant="h6" className="text-stieglitz">
          {Bottom}
        </Typography>
      </Box>
    </Box>
  );
};
export default StatBox;

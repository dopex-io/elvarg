import { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import * as yup from 'yup';
import Input from '@material-ui/core/Input';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';

const Bid = ({ open, handleClose, data }) => {
  const validationSchema = yup.object({
    bid: yup.number().min(0, 'Amount must be greater than 0.'),
  });

  const formik = useFormik({
    initialValues: {
      bid: '',
    },
    onSubmit: noop,
    validationSchema: validationSchema,
  });

  const handleSubmit = useCallback(() => {}, []);
  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('bid', e.target.value);
    },
    [formik]
  );
  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="space-y-4 flex flex-col">
        <Typography variant="h5">Close RFQ</Typography>
        <Box className="flex flex-col bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft">
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Status
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Time
            </Typography>
            <Typography variant="h6">{'Quote'}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Option
            </Typography>
            <Typography variant="h6">{'Ask Price'}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Base
            </Typography>
            <Typography variant="h6">{'Base'}</Typography>
          </Box>
        </Box>
        {/* <Input
          disableUnderline={true}
          id="bid"
          name="bid"
          onChange={handleChange}
          type="number"
          className="h-8 text-sm text-white self-end bg-umbra rounded-lg p-2"
          placeholder="Enter Bid"
          fullWidth
        /> */}
        <CustomButton color="primary" size="medium" onClick={handleSubmit}>
          Close
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default Bid;

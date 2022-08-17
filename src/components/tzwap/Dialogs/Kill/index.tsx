import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

export interface Props {
  openOrder: number | null;
  setOpenOrder: Dispatch<SetStateAction<number | null>>;
  handleKill: () => {};
}

const Kill = ({ openOrder, setOpenOrder, handleKill }: Props) => {
  return (
    <Dialog
      open={openOrder !== null}
      classes={{
        paper: 'bg-cod-gray p-2 rounded-xl w-[25rem]',
      }}
    >
      <Box>
        <Box className={'flex p-3'}>
          <Typography variant="h4" className="mb-4 ml-2">
            Kill Tzwap
          </Typography>

          <img
            src={'/assets/dark-cross.svg'}
            className={
              'ml-auto w-4 h-4 mt-2 mr-2 hover:opacity-90 cursor-pointer'
            }
            onClick={() => setOpenOrder(null)}
            alt={'Close'}
          />
        </Box>
        <Box className="text-justify pl-5 pr-5">
          <Typography variant="h5" component="p" className={'text-stieglitz'}>
            Killing a Tzwap means that your order will stop being filled by bots
            and that you’ll get your initial collateral back minus what has
            already been filled by bots.
          </Typography>
        </Box>

        <Box className={'pl-6 pr-6 mb-4 mt-3'}>
          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
            color={'primary'}
            onClick={() => handleKill()}
          >
            <img
              src={'/assets/killpepe.svg'}
              className={'w-3 h-3 mr-2'}
              alt={'Kill pepe'}
            />
            Kill Tzwap
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Kill;

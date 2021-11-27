import { useCallback, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

import { Ssov } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import styles from './styles.module.scss';

const ManageCard = ({ ssov }: { ssov: Ssov }) => {
  const [isDeposit, setIsDeposit] = useState(true);
  const { accountAddress } = useContext(WalletContext);

  const handleChangeToDeposit = useCallback(() => {
    setIsDeposit(true);
  }, []);

  const handleChangeToWithdraw = useCallback(() => {
    setIsDeposit(false);
  }, []);
  const { selectedEpoch } = ssov;

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl',
        styles.cardWidth
      )}
    >
      <Box className="flex flex-row mb-4 justify-between">
        <IconButton className="p-0 pr-3 pb-1">
          <Link to="/ssov">
            <ArrowBackIcon className="text-stieglitz" />
          </Link>
        </IconButton>
        <Box className="flex flex-row w-full items-center justify-between">
          <Typography variant="h4" className="">
            {isDeposit ? 'Deposit' : 'Withdraw'}
          </Typography>
          <Box className="flex flex-row">
            <CustomButton
              size="medium"
              className={cx(
                isDeposit
                  ? 'mr-1'
                  : 'bg-umbra text-stieglitz hover:bg-umbra mr-1'
              )}
              onClick={handleChangeToDeposit}
            >
              Deposit
            </CustomButton>
            <CustomButton
              size="medium"
              className={cx(
                !isDeposit ? 'mr-1' : 'bg-umbra text-stieglitz hover:bg-umbra'
              )}
              onClick={handleChangeToWithdraw}
              disabled={selectedEpoch < 1 || accountAddress === ''}
            >
              Withdraw
            </CustomButton>
          </Box>
        </Box>
      </Box>
      {isDeposit ? <Deposit ssov={ssov} /> : <Withdraw ssov={ssov} />}
    </Box>
  );
};
export default ManageCard;

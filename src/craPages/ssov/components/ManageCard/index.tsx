import { useCallback, useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Badge from '@material-ui/core/Badge';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import BnbSsovDeposit from './bnbSsov/BnbSsovDeposit';

import { SsovContext, SsovProperties } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import styles from './styles.module.scss';

const ManageCard = ({ ssovProperties }: { ssovProperties: SsovProperties }) => {
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  const [isZapActive, setIsZapActive] = useState<boolean>(false);

  const { selectedSsov, userSsovDataArray, ssovDataArray } =
    useContext(SsovContext);
  const { accountAddress } = useContext(WalletContext);

  const handleChangeToDeposit = useCallback(() => {
    setIsDeposit(true);
  }, []);

  const handleChangeToWithdraw = useCallback(() => {
    setIsDeposit(false);
  }, []);

  const { selectedEpoch, tokenName } = ssovProperties;
  const { userEpochDeposits } = userSsovDataArray[selectedSsov];
  const { isEpochExpired } = ssovDataArray[selectedSsov];
  const badgeContentProps = useMemo(
    () =>
      isEpochExpired && userEpochDeposits > '0' ? { badgeContent: '!' } : null,
    [isEpochExpired, userEpochDeposits]
  );
  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-5 h-[40rem]',
        styles.cardWidth
      )}
    >
      <Box className="flex flex-row mb-4 justify-between">
        <Box
          className={
            isDeposit
              ? 'text-center w-1/2 pb-3 border-[#22E1FF] border-b-[0.2px] cursor-pointer group'
              : 'text-center w-1/2 pb-3 cursor-pointer group'
          }
          onClick={() => setIsDeposit(true)}
        >
          <Typography variant="h5" className="text-xs font-normal">
            Deposit
          </Typography>
        </Box>
        <Box
          className={
            !isDeposit
              ? 'text-center w-1/2 pb-3 border-[#22E1FF] border-b-[0.2px] cursor-pointer group'
              : 'text-center w-1/2 pb-3 cursor-pointer group'
          }
          onClick={() => setIsDeposit(false)}
        >
          <Typography variant="h5" className="text-xs font-normal">
            Withdraw
          </Typography>
        </Box>
      </Box>
      {isDeposit ? (
        tokenName === 'BNB' ? (
          <BnbSsovDeposit ssovProperties={ssovProperties} />
        ) : (
          <Deposit ssovProperties={ssovProperties} isZapActive={isZapActive} />
        )
      ) : (
        <Withdraw ssovProperties={ssovProperties} />
      )}
    </Box>
  );
};
export default ManageCard;

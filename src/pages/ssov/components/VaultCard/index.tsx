import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import format from 'date-fns/format';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import PurchaseDialog from '../ManageCard/PurchaseDialog';
import InfoBox from '../InfoBox';

import dpxLogo from 'assets/tokens/dpx.svg';
import Dpx from 'assets/icons/DpxIcon';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

interface VaultCardProps {
  className?: string;
}

function VaultCard(props: VaultCardProps) {
  const { className } = props;
  const history = useHistory();
  const {
    currentEpoch,
    nextEpoch,
    nextEpochSsovData: { epochTimes, totalEpochDeposits, userEpochDeposits },
    dpxTokenPrice,
    currentEpochSsovData,
    APY,
  } = useContext(SsovContext);
  const [purchaseState, setPurchaseState] = useState<boolean>(false);

  const TVL =
    currentEpochSsovData.totalEpochDeposits && dpxTokenPrice
      ? getUserReadableAmount(currentEpochSsovData.totalEpochDeposits, 18) *
        getUserReadableAmount(dpxTokenPrice, 8)
      : 0;

  const info = [
    {
      icon: Dpx,
      heading: 'Asset',
      value: 'DPX',
    },
    {
      icon: Action,
      heading: 'APY',
      value: APY || '...',
    },
    {
      icon: Coin,
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
    },
  ];

  // Ssov data for next epoch
  const userEpochDepositsAmount = getUserReadableAmount(
    userEpochDeposits,
    18
  ).toString();
  const totalEpochDepositsAmount = getUserReadableAmount(
    totalEpochDeposits,
    18
  ).toString();

  const epochTimePeriod =
    epochTimes[0] && epochTimes[1]
      ? `${format(new Date(epochTimes[0] * 1000), 'MM/dd/yyyy')} - ${format(
          new Date(epochTimes[1] * 1000),
          'MM/dd/yyyy'
        )}`
      : 'N/A';

  return (
    <Box
      className={cx('p-0.5 rounded-xl mx-auto', styles['WETH'], styles.Border)}
    >
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          styles.Box,
          className
        )}
      >
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row">
              <img src={dpxLogo} alt="Icon" />
            </Box>
            <Box className="flex items-center">
              <Typography variant="h5">DPX Options Vault</Typography>
            </Box>
          </Box>
          <Box className="border-umbra rounded-xl border p-4 flex flex-col mb-4">
            <Typography variant="h6" className="mb-4">
              Single Staking Vault
            </Typography>
            <Typography
              variant="caption"
              component="div"
              className="mb-4 text-left text-stieglitz"
            >
              Returns are generated via an automated compound strategy in the
              DPX farm where all yield is collectively used to sell Call
              Options.
            </Typography>
            <Typography
              variant="caption"
              component="a"
              className="text-wave-blue text-left"
              // @ts-ignore
              target="_blank"
              rel="noopener noreferrer"
              href="https://blog.dopex.io/introducing-single-staking-option-vaults-ssov-b90bbb0a9ae5"
            >
              Read More
            </Typography>
          </Box>
          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item) => {
              return (
                <InfoBox
                  key={item.heading}
                  Icon={item.icon}
                  heading={item.heading}
                  value={item.value}
                />
              );
            })}
          </Box>
          <Box>
            <Accordion className="bg-umbra shadow-none rounded-xl">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-stieglitz" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Vault Properties
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="flex flex-col w-full">
                  <Box className="flex flex-row justify-between mb-3">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Epoch
                    </Typography>
                    <Typography variant="caption" component="div">
                      Monthly
                    </Typography>
                  </Box>
                  <Box className="flex flex-row justify-between mb-3">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Next Epoch
                    </Typography>
                    <Typography variant="caption" component="div">
                      {epochTimePeriod}
                    </Typography>
                  </Box>
                  <Box className="flex flex-row justify-between mb-3">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Deposits
                    </Typography>
                    <Typography variant="caption" component="div">
                      <span className="text-wave-blue">
                        {userEpochDepositsAmount}
                      </span>{' '}
                      DPX / {totalEpochDepositsAmount} DPX
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box className="grid grid-cols-2 gap-2 my-4">
            <CustomButton
              size="medium"
              onClick={() => {
                history.push('/ssov/manage');
              }}
            >
              Deposit
            </CustomButton>
            <CustomButton
              size="medium"
              className={cx('', styles.Button)}
              onClick={() => {
                setPurchaseState(true);
              }}
              disabled={currentEpoch < 1}
            >
              Buy Options
            </CustomButton>
          </Box>
          <Typography
            variant="h6"
            className="text-wave-blue text-right block"
            component="a"
            // @ts-ignore
            href="/ssov/manage#balances"
          >
            View Options
          </Typography>
          <Typography variant="h6" className="text-stieglitz">
            Epoch {nextEpoch}
          </Typography>
        </Box>
      </Box>
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          handleClose={
            (() => {
              setPurchaseState(false);
            }) as any
          }
        />
      )}
    </Box>
  );
}

export default VaultCard;

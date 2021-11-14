import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';

import format from 'date-fns/format';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import PurchaseDialog from '../PurchaseDialog';
import InfoBox from '../InfoBox';

import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

interface SsovCardProps {
  className?: string;
  ssov: 'dpx' | 'rdpx';
}

function SsovCard(props: SsovCardProps) {
  const { className, ssov } = props;
  const navigate = useNavigate();
  const context = useContext(SsovContext);
  const {
    selectedEpoch,
    ssovData: { epochTimes, totalEpochDeposits },
    userSsovData: { userEpochDeposits },
    tokenPrice,
    APY,
  } = context[ssov];
  const [purchaseState, setPurchaseState] = useState<boolean>(false);

  const TVL =
    totalEpochDeposits && tokenPrice
      ? getUserReadableAmount(totalEpochDeposits, 18) *
        getUserReadableAmount(tokenPrice, 8)
      : 0;

  const tokenSymbol = ssov === 'dpx' ? 'DPX' : 'rDPX';

  const info = [
    {
      icon: ssov === 'dpx' ? Dpx : Rdpx,
      heading: 'Asset',
      value: tokenSymbol,
    },
    {
      icon: Action,
      heading: 'APY',
      value: `${APY ? `${APY}%` : '...'}`,
      toolTip: 'This is the base APY calculated from the single staking farm',
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
  ).toFixed(3);
  const totalEpochDepositsAmount = getUserReadableAmount(
    totalEpochDeposits,
    18
  ).toFixed(3);

  const epochTimePeriod =
    epochTimes[0] && epochTimes[1]
      ? `${format(new Date(epochTimes[0] * 1000), 'MM/dd/yyyy')} - ${format(
          new Date(epochTimes[1] * 1000),
          'MM/dd/yyyy'
        )}`
      : 'N/A';

  return (
    <Box className={cx('p-0.5 rounded-xl', styles['WETH'], styles.Box)}>
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          className
        )}
      >
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row">
              <img
                src={ssov === 'dpx' ? '/assets/dpx.svg' : '/assets/rdpx.svg'}
                alt={tokenSymbol}
              />
            </Box>
            <Box className="flex items-center">
              <Typography variant="h5">{tokenSymbol} Options Vault</Typography>
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
              Returns are generated via an automated compound strategy in the{' '}
              {tokenSymbol} farm where all yield is collectively used to sell
              Call Options.
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
              return item.toolTip ? (
                <InfoBox
                  key={item.heading}
                  Icon={item.icon}
                  heading={item.heading}
                  value={item.value}
                  toolTip={item.toolTip}
                />
              ) : (
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
            <Box className="bg-umbra shadow-none rounded-lg">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz text-sm px-4 pt-2"
              >
                Vault Properties
              </Typography>
              <Box className="flex flex-col w-full p-4">
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
                <Box className="flex flex-row justify-between">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    Deposits
                  </Typography>
                  <Typography variant="caption" component="div">
                    <span className="text-wave-blue">
                      {formatAmount(userEpochDepositsAmount, 5)}
                    </span>{' '}
                    {tokenSymbol} / {formatAmount(totalEpochDepositsAmount, 5)}{' '}
                    {tokenSymbol}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="grid grid-cols-2 gap-2 my-4">
            <CustomButton
              size="medium"
              onClick={() =>
                navigate(`/ssov/manage/${ssov === 'dpx' ? 'dpx' : 'rdpx'}`)
              }
            >
              Deposit
            </CustomButton>
            <CustomButton
              size="medium"
              className={cx('', styles.Button)}
              onClick={() => {
                setPurchaseState(true);
              }}
            >
              Buy Options
            </CustomButton>
          </Box>
          <Typography
            variant="h6"
            className="text-wave-blue text-right block"
            component="a"
            // @ts-ignore
            href={`/ssov/manage/${ssov === 'dpx' ? 'dpx' : 'rdpx'}#balances`}
          >
            View Options
          </Typography>
          <Typography variant="h6" className="text-stieglitz">
            Epoch {selectedEpoch}
          </Typography>
        </Box>
      </Box>
      {purchaseState && (
        <PurchaseDialog
          ssov={ssov}
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

export default SsovCard;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import format from 'date-fns/format';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import PurchaseDialog from '../PurchaseDialog';
import InfoBox from '../InfoBox';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';
import { Ssov, SsovData, UserSsovData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';

interface SsovCardProps {
  className?: string;
  ssov: Ssov;
  ssovData: SsovData;
  userSsovData: UserSsovData;
  ssovIndex: number;
  setSelectedSsov: Function;
}

function SsovCard(props: SsovCardProps) {
  const {
    className,
    ssov,
    ssovData,
    userSsovData,
    ssovIndex,
    setSelectedSsov,
  } = props;
  const navigate = useNavigate();
  const { selectedEpoch, cgTokenPrice, tokenName } = ssov;
  const { epochTimes, totalEpochDeposits, APY, isVaultReady } = ssovData;
  const { userEpochDeposits } =
    userSsovData !== undefined ? userSsovData : { userEpochDeposits: 0 };
  const [purchaseState, setPurchaseState] = useState<boolean>(false);

  const TVL =
    totalEpochDeposits && cgTokenPrice
      ? getUserReadableAmount(totalEpochDeposits, 18) * cgTokenPrice
      : 0;

  const tokenSymbol = tokenName === 'RDPX' ? 'rDPX' : tokenName;

  const info = [
    {
      icon: SSOV_MAP[ssov.tokenName].icon,
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
    <Box className={cx('p-0.5 rounded-xl', styles[tokenName], styles.Box)}>
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          className
        )}
      >
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row">
              <img src={SSOV_MAP[ssov.tokenName].imageSrc} alt={tokenSymbol} />
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
                    Epoch Duration
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
              onClick={() => navigate(`/ssov/manage/${tokenName}`)}
            >
              Manage
            </CustomButton>
            <Tooltip
              className="text-stieglitz"
              title={
                !isVaultReady
                  ? 'Options can not be bought during the deposit period'
                  : ''
              }
            >
              <Box className="w-full">
                <CustomButton
                  size="medium"
                  className={cx('w-full', styles.Button)}
                  onClick={() => {
                    setPurchaseState(true);
                    setSelectedSsov(ssovIndex);
                  }}
                  disabled={!isVaultReady}
                >
                  Buy Options
                </CustomButton>
              </Box>
            </Tooltip>
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            Epoch {selectedEpoch}
          </Typography>
        </Box>
      </Box>
      {purchaseState && (
        <PurchaseDialog
          ssov={ssov}
          userSsovData={userSsovData}
          ssovData={ssovData}
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

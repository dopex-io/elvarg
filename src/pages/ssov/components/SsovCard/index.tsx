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
import rdpxLogo from 'assets/tokens/rdpx.svg';
import Dpx from 'assets/icons/DpxIcon';
import Rdpx from 'assets/tokens/Rdpx';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import styles from './styles.module.scss';

interface SsovCardProps {
  className?: string;
  ssov: string;
}

function SsovCard(props: SsovCardProps) {
  const { className, ssov } = props;
  const history = useHistory();
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

  const tokenSymbol = ssov === 'ssovDpx' ? 'DPX' : 'rDPX';

  const info = [
    {
      icon: ssov === 'ssovDpx' ? Dpx : Rdpx,
      heading: 'Asset',
      value: tokenSymbol,
    },
    {
      icon: Action,
      heading: 'Farm APY',
      value: `${APY}%` || '...',
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
    <Box className={cx('p-0.5 rounded-xl', styles['WETH'], styles.Border)}>
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
              <img
                src={ssov === 'ssovDpx' ? dpxLogo : rdpxLogo}
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
                      {tokenSymbol} / {totalEpochDepositsAmount} {tokenSymbol}
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
                history.push(
                  `/ssov/manage/${ssov === 'ssovDpx' ? 'dpx' : 'rdpx'}`
                );
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
              disabled={ssov === 'ssovRdpx'}
            >
              Buy Options
            </CustomButton>
          </Box>
          <Typography
            variant="h6"
            className="text-wave-blue text-right block"
            component="a"
            // @ts-ignore
            href={`/ssov/manage/${
              ssov === 'ssovDpx' ? 'dpx' : 'rdpx'
            }#balances`}
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
          ssov="ssovDpx"
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

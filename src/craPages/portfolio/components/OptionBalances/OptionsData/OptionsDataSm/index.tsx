import { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import format from 'date-fns/format';
import { ERC20 } from '@dopex-io/sdk';
import { BigNumber, utils as ethersUtils } from 'ethers';

import Typography from 'components/UI/Typography';
import OptionActionDialog from 'craPages/portfolio/components/OptionActionDialog';
import CustomButton from 'components/UI/CustomButton';
import LessThanOneAmount from 'components/LessThanOneAmount';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useOptionActions from 'hooks/useOptionActions';

import { BASE_ASSET_MAP } from 'constants/index';

const CustomizedTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

interface OptionDataSmProps {
  asset: string;
  expiry: string;
  strike: string;
  isPut: boolean;
  userBalance: string;
  optionsContract: ERC20;
  optionsContractId: string;
  assetPrice: string;
  isDelegated?: boolean;
  claimAmount?: string;
}

const OptionsDataLabels = ({ children }) => {
  return (
    <Typography variant="h6" component="div" className="py-1 text-stieglitz">
      {children}
    </Typography>
  );
};

const OptionsDataValues = ({ children, className = null }) => {
  return (
    <Typography
      variant="h6"
      component="div"
      className={`text-white py-1 ${className}`}
    >
      {children}
    </Typography>
  );
};

const OptionDataSm = (props: OptionDataSmProps) => {
  const {
    strike,
    expiry,
    userBalance,
    asset,
    isPut,
    optionsContract,
    optionsContractId,
    assetPrice,
    isDelegated,
    claimAmount,
  } = props;

  const optionActions = useOptionActions({
    strike,
    userBalance,
    expiry,
    asset,
    isPut,
    optionsContract,
    optionsContractId,
    assetPrice,
    claimAmount,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );
  const handleClose = useCallback(() => setAnchorEl(null), []);

  return (
    <Box
      className="bg-umbra rounded-md mx-4 my-2 flex flex-col flex-wrap"
      key={asset}
    >
      <Box className="p-3 flex">
        <Box className="flex">
          <img
            src={`/static/svg/tokens/${BASE_ASSET_MAP[
              asset
            ].symbol.toLowerCase()}.svg`}
            className="my-auto w-8 h-8"
            alt="Symbol"
          />
          <Typography variant="h5" className="my-auto ml-3 mr-2">
            {BASE_ASSET_MAP[asset].symbol}
          </Typography>
          <span className="bg-mineshaft px-2 py-2 my-auto mx-2 rounded-md text-xs font-light">
            {isPut ? 'PUT' : 'CALL'}
          </span>
        </Box>
        <Box className="flex-grow"></Box>
        <Box className="flex">
          {!isDelegated ? (
            <CustomizedTooltip title="Option needs to be in exercise window. Exercise window starts 1 hour before the time of expiry. Exercise window is 7:00 AM UTC to 8:00 AM UTC.">
              <span>
                <CustomButton
                  size="medium"
                  disabled={!optionActions.canExercise}
                  onClick={
                    optionActions.canExercise
                      ? optionActions.handleExercise
                      : null
                  }
                  className="px-2 mr-2"
                  color={optionActions.isExpired ? 'cod-gray' : 'primary'}
                >
                  {optionActions.isExpired ? 'Expired' : 'Exercise'}
                </CustomButton>
              </span>
            </CustomizedTooltip>
          ) : Number(claimAmount ?? 0) === 0 ? (
            <CustomizedTooltip title="Auto exercise enabled">
              <span>
                <CustomButton
                  size="medium"
                  disabled
                  className="px-2 mr-2"
                  color={'primary'}
                >
                  {'Delegated'}
                </CustomButton>
              </span>
            </CustomizedTooltip>
          ) : (
            <span>
              <CustomButton
                size="medium"
                onClick={optionActions.handleClaim}
                className="px-2 mr-2"
                color={'primary'}
              >
                {'Claim P&L'}
              </CustomButton>
            </span>
          )}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
            className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft"
          >
            <MoreVertIcon className="fill-current text-white" />
          </IconButton>
        </Box>
        <Box className="flex">
          {!isDelegated ? (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              classes={{ paper: 'bg-umbra' }}
            >
              <MenuItem onClick={handleClose} className="px-1">
                <Button
                  variant="text"
                  className=" text-stieglitz"
                  onClick={optionActions.handleTransfer}
                >
                  {'Transfer'}
                </Button>
              </MenuItem>
              <MenuItem onClick={handleClose} className="px-1">
                <Button
                  variant="text"
                  className=" text-stieglitz bg-umbra mx-auto"
                  onClick={optionActions.handleSwap}
                >
                  {'Swap'}
                </Button>
              </MenuItem>
              <MenuItem onClick={handleClose} className="px-1">
                <Button
                  variant="text"
                  className=" text-stieglitz bg-umbra mx-auto"
                  onClick={optionActions.handleDelegate}
                >
                  Auto Exercise
                </Button>
              </MenuItem>
            </Menu>
          ) : (
            Number(claimAmount ?? 0) === 0 && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: 'bg-umbra' }}
              >
                <MenuItem onClick={handleClose} className="px-1">
                  <Button
                    variant="text"
                    className=" text-stieglitz"
                    onClick={optionActions.handleWithdraw}
                  >
                    Undelegate
                  </Button>
                </MenuItem>
              </Menu>
            )
          )}
          <OptionActionDialog
            open={optionActions.modal.open}
            type={optionActions.modal.type}
            data={optionActions.modal.data}
            icon={`/static/svg/tokens/${BASE_ASSET_MAP[
              asset
            ].symbol.toLowerCase()}.svg`}
            closeModal={optionActions.closeModal}
          />
        </Box>
      </Box>
      <Box className="flex justify-between px-2">
        <Box className="flex flex-col m-2 items-start">
          <OptionsDataLabels>Strike</OptionsDataLabels>
          <OptionsDataLabels>Expiry</OptionsDataLabels>
          <OptionsDataLabels>Amount</OptionsDataLabels>
          <OptionsDataLabels>Premium Paid</OptionsDataLabels>
          <OptionsDataLabels>Current Value</OptionsDataLabels>
          <OptionsDataLabels>Final P&L</OptionsDataLabels>
        </Box>
        <Box className="flex flex-col m-2 text-sm font-light items-end">
          <OptionsDataValues>
            ${formatAmount(getUserReadableAmount(strike, 8).toString())}
          </OptionsDataValues>
          <OptionsDataValues>
            {format(optionActions.expiryDate, 'dd LLL yy').toLocaleUpperCase()}
          </OptionsDataValues>
          <OptionsDataValues>
            {BigNumber.from(userBalance).gt(
              ethersUtils.parseEther('0.0001')
            ) ? (
              formatAmount(getUserReadableAmount(userBalance, 18).toString(), 5)
            ) : (
              <LessThanOneAmount value={userBalance} />
            )}
          </OptionsDataValues>

          <OptionsDataValues>
            ${formatAmount(optionActions.premium)}
          </OptionsDataValues>
          <OptionsDataValues>
            $
            {formatAmount(
              Number(claimAmount ?? 0) > 0
                ? optionActions.userClaimAmount
                : optionActions.currentValue,
              2
            )}
          </OptionsDataValues>
          <OptionsDataValues>
            <span className={getValueColorClass(optionActions.pnl)}>
              ${formatAmount(optionActions.pnl, 2)}
            </span>
          </OptionsDataValues>
        </Box>
      </Box>
    </Box>
  );
};

export default OptionDataSm;

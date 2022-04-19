import { useCallback, useState } from 'react';
import format from 'date-fns/format';
import withStyles from '@mui/styles/withStyles';
import TableRow from '@mui/material/TableRow';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ERC20 } from '@dopex-io/sdk';
import { BigNumber, utils as ethersUtils } from 'ethers';

import useOptionActions from 'hooks/useOptionActions';

import OptionActionDialog from 'craPages/portfolio/components/OptionActionDialog';
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { BASE_ASSET_MAP } from 'constants/index';
import LessThanOneAmount from 'components/LessThanOneAmount';

const TableBodyCell = ({ children, align = 'left' }) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className="text-white text-sm border-0"
    >
      {children}
    </TableCell>
  );
};

const CustomizedTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

interface OptionTableDataProps {
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

const OptionsTableData = (props: OptionTableDataProps) => {
  const {
    strike,
    assetPrice,
    expiry,
    userBalance,
    asset,
    isPut,
    optionsContract,
    optionsContractId,
    isDelegated,
    claimAmount,
  } = props;
  const optionActions = useOptionActions({
    strike,
    assetPrice,
    expiry,
    userBalance,
    asset,
    isPut,
    optionsContract,
    optionsContractId,
    claimAmount,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );
  const handleClose = useCallback(() => setAnchorEl(null), []);
  return (
    <TableRow className="text-white bg-umbra">
      <TableBodyCell>
        <img
          src={`/static/svg/tokens/${BASE_ASSET_MAP[
            asset
          ].symbol.toLowerCase()}.svg`}
          className="w-8 h-8 inline mr-4"
          alt="Symbol"
        />
        {BASE_ASSET_MAP[asset].symbol}
      </TableBodyCell>
      <TableBodyCell>
        {format(optionActions.expiryDate, 'd LLL yyyy').toLocaleUpperCase()}
      </TableBodyCell>
      <TableBodyCell>
        {BigNumber.from(userBalance).gt(ethersUtils.parseEther('0.0001')) ? (
          formatAmount(getUserReadableAmount(userBalance, 18).toString(), 5)
        ) : (
          <LessThanOneAmount value={userBalance} />
        )}
      </TableBodyCell>
      <TableBodyCell>{isPut ? 'PUT' : 'CALL'}</TableBodyCell>
      <TableBodyCell>
        ${formatAmount(getUserReadableAmount(strike, 8).toString(), 5)}
      </TableBodyCell>
      <TableBodyCell>${formatAmount(optionActions.premium)}</TableBodyCell>
      <TableBodyCell>
        $
        {formatAmount(
          Number(claimAmount ?? 0) > 0
            ? optionActions.userClaimAmount
            : optionActions.currentValue,
          2
        )}
      </TableBodyCell>
      <TableBodyCell>
        <span className={getValueColorClass(optionActions.pnl)}>
          ${formatAmount(optionActions.pnl, 2)}
        </span>
      </TableBodyCell>
      <TableBodyCell align="right">
        <Box className="flex justify-end">
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
            <CustomizedTooltip title="Auto-exercise enabled">
              <span>
                <CustomButton
                  size="medium"
                  disabled
                  className="px-2 mr-2"
                  color={optionActions.isExpired ? 'cod-gray' : 'primary'}
                >
                  {optionActions.isExpired ? 'Expired' : 'Delegated'}
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
            className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft hidden sm:flex"
            size="large"
          >
            <MoreVertIcon className="fill-current text-white" />
          </IconButton>
          <Box className="flex flex-row">
            {!isDelegated ? (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: 'bg-umbra' }}
              >
                <MenuItem
                  onClick={() => {
                    optionActions.handleTransfer();
                    handleClose();
                  }}
                  className=" text-white"
                >
                  Transfer
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    optionActions.handleSwap();
                    handleClose();
                  }}
                  className=" text-white"
                >
                  Swap
                </MenuItem>
                {!optionActions.isExpired && !optionActions.canExercise && (
                  <MenuItem
                    onClick={() => {
                      optionActions.handleDelegate();
                      handleClose();
                    }}
                    className=" text-white"
                  >
                    Auto Exercise
                  </MenuItem>
                )}
              </Menu>
            ) : (
              Number(claimAmount ?? 0) === 0 && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  classes={{ paper: 'bg-umbra' }}
                >
                  <MenuItem
                    onClick={() => {
                      optionActions.handleWithdraw();
                      handleClose();
                    }}
                    className=" text-white"
                  >
                    Undelegate
                  </MenuItem>
                </Menu>
              )
            )}
          </Box>
        </Box>
      </TableBodyCell>
      <OptionActionDialog
        open={optionActions.modal.open}
        type={optionActions.modal.type}
        data={optionActions.modal.data}
        icon={`/static/svg/tokens/${BASE_ASSET_MAP[
          asset
        ].symbol.toLowerCase()}.svg`}
        closeModal={optionActions.closeModal}
      />
    </TableRow>
  );
};

export default OptionsTableData;

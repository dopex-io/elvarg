import {
  MouseEventHandler,
  useReducer,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { BigNumber, utils } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import Typography from 'components/UI/Typography';
import Button from 'components/UI/Button';
import {
  DialogRow,
  LiquidityDialogRow,
  NumberLiquidityDialogRow,
} from 'components/common/LpCommon/Table';

import { LpPosition } from 'store/Vault/olp';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import {
  DECIMALS_TOKEN,
  DECIMALS_STRIKE,
  DECIMALS_USD,
  MAX_VALUE,
} from 'constants/index';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Addresses, ERC20__factory, ERC721__factory } from '@dopex-io/sdk';
import { CustomButton, Dialog } from 'components/UI';
import useUserTokenBalance from 'hooks/useUserTokenBalance';
import { SsovLendingData } from 'store/Vault/lending';
import InputHelpers from 'components/common/InputHelpers';
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: SsovLendingData;
}

export default function BorrowDialog({
  anchorEl,
  setAnchorEl,
  assetDatum,
}: Props) {
  const { accountAddress, signer, provider } = useBoundStore();

  const sendTx = useSendTx();

  const tokenAddress =
    Addresses[assetDatum.chainId][assetDatum.underlyingSymbol];
  const userTokenBalance = useUserTokenBalance(
    accountAddress!,
    tokenAddress,
    signer
  );
  const [strike, setStrike] = useState(0);
  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrike(Number(event.target.value));
  }, []);

  const [tokenApproved, setTokenApproved] = useState<boolean>(false);
  const [tokenDepositAmount, setTokenDepositAmount] = useState<string | number>(
    0
  );

  const handleAssetApprove = useCallback(async () => {
    if (!signer || !assetDatum || !tokenAddress) return;
    try {
      const token = await ERC20__factory.connect(tokenAddress, signer);
      await sendTx(token, 'approve', [assetDatum.address, MAX_VALUE]);
      setTokenApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, assetDatum, tokenAddress]);

  const handleDepositAmount = useCallback(async () => {
    const contract = SsovV4Put__factory.connect(assetDatum.address, provider);
    try {
      await contract.borrow(strike, tokenDepositAmount);
    } catch (e) {
      console.log('fail to deposit');
      throw new Error('fail to deposit');
    }
  }, [tokenDepositAmount, strike, assetDatum, provider]);

  const handleMax = useCallback(() => {
    setTokenDepositAmount(utils.formatEther(userTokenBalance));
  }, [userTokenBalance]);

  return (
    <Dialog
      open={anchorEl != null}
      handleClose={() => setAnchorEl(null)}
      disableScrollLock={true}
      sx={{
        '.MuiPaper-root': {
          padding: '12px',
        },
      }}
      width={368}
    >
      <Box className="bg-cod-gray rounded-lg">
        <Box className="flex flex-col mb-2">
          <Typography variant="h5">Borrow</Typography>
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
            <SsovStrikeBox
              userTokenBalance={userTokenBalance}
              collateralSymbol={assetDatum?.underlyingSymbol}
              strike={strike}
              handleSelectStrike={handleSelectStrike}
              strikes={assetDatum?.strikes.map((s) => s.toString())}
            />
            <Box className="flex mt-2 group">
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                {assetDatum.underlyingSymbol} to deposit
              </Typography>
              <Box className="relative">
                <InputHelpers handleMax={handleMax} />
                <Input
                  disableUnderline={true}
                  type="number"
                  className="w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                  classes={{ input: 'text-white text-xs text-right' }}
                  value={tokenDepositAmount}
                  placeholder="0"
                  onChange={handleDepositAmount}
                />
              </Box>
            </Box>
          </Box>

          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
            color={
              !tokenApproved ||
              (tokenDepositAmount > 0 &&
                tokenDepositAmount <=
                  getUserReadableAmount(userTokenBalance, 18))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={tokenDepositAmount <= 0}
            onClick={tokenApproved ? handleDepositAmount : handleAssetApprove}
          >
            {tokenApproved
              ? tokenDepositAmount == 0
                ? 'Insert an amount'
                : tokenDepositAmount >
                  getUserReadableAmount(userTokenBalance, 18)
                ? 'Insufficient balance'
                : 'Deposit'
              : 'Approve'}
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
}

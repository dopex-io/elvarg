import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  SetStateAction,
} from 'react';
import { BigNumber } from 'ethers';
import {
  CurveStableswapPair__factory,
  DscToken,
  DscToken__factory,
  MockToken__factory,
} from '@dopex-io/sdk';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import { Input } from 'components/UI';
import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE } from 'constants/index';

const TOKEN_DATA_KEYS = ['symbol', 'address', 'totalSupply', 'balance'];

type TokenData = {
  symbol: string;
  address: string;
  totalSupply: BigNumber;
  balance: BigNumber;
};

const INIT_TOKEN_DATA: TokenData = {
  symbol: '',
  address: '',
  totalSupply: BigNumber.from(0),
  balance: BigNumber.from(0),
};

// interface Props {
//   tokens: [string, string];
// }

const SwapPanel = () => {
  // const [tokenA, tokenB] = tokens;
  const sendTx = useSendTx();

  const { accountAddress, signer, contractAddresses, treasuryContractState } =
    useBoundStore();

  const [pair, setPair] = useState<TokenData[]>([]);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('');
  const [inverted, setInverted] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);

  const path: TokenData[] = useMemo(() => {
    if (!pair[0] || !pair[1]) return [INIT_TOKEN_DATA, INIT_TOKEN_DATA];
    return inverted ? [pair[0], pair[1]] : [pair[1], pair[0]];
  }, [inverted, pair]);

  const handleAmountIn = useCallback(
    (e: { target: { value: SetStateAction<string> } }) => {
      setAmountIn(e.target.value);
    },
    []
  );

  const handleInvert = useCallback(() => {
    setInverted(!inverted);
  }, [inverted]);

  const handleApprove = useCallback(async () => {
    if (
      !path[0] ||
      !path[0].address ||
      !signer ||
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.curvePool
    )
      return;

    const _tokenContract =
      path[0].symbol === 'DSC'
        ? DscToken__factory.connect(path[0].address, signer)
        : MockToken__factory.connect(path[0].address, signer);

    try {
      await sendTx(_tokenContract, 'approve', [
        treasuryContractState.contracts.curvePool.address,
        MAX_VALUE,
      ]);
    } catch (e) {
      console.log(e);
    }
  }, [path, sendTx, signer, treasuryContractState.contracts]);

  const handleSwap = useCallback(async () => {
    if (
      !path[0] ||
      !path[0].address ||
      !signer ||
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.curvePool
    )
      return;

    const curvePool = CurveStableswapPair__factory.connect(
      treasuryContractState.contracts.curvePool.address,
      signer
    );

    const dy = await curvePool.get_dy(
      inverted ? 0 : 1,
      inverted ? 1 : 0,
      getContractReadableAmount(amountIn, 18)
    );

    try {
      await sendTx(curvePool, 'exchange(int128,int128,uint256,uint256)', [
        inverted ? 0 : 1,
        inverted ? 1 : 0,
        getContractReadableAmount(amountIn, 18),
        dy,
      ]);
    } catch (e) {
      console.log(e);
    }
  }, [
    amountIn,
    inverted,
    path,
    sendTx,
    signer,
    treasuryContractState.contracts,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !treasuryContractState.contracts ||
        !contractAddresses ||
        !signer ||
        !accountAddress
      )
        return;

      const alpha_token = MockToken__factory.connect(
        contractAddresses['WETH'],
        signer
      );

      const dsc: DscToken = treasuryContractState.contracts.dsc;

      const tokenA = await Promise.all([
        alpha_token.symbol(),
        alpha_token.address,
        alpha_token.totalSupply(),
        alpha_token.balanceOf(accountAddress),
      ]).then((res) => {
        return TOKEN_DATA_KEYS.reduce((prev, curr, index) => {
          return { ...prev, [curr]: res[index] };
        }, INIT_TOKEN_DATA);
      });

      const tokenB = await Promise.all([
        dsc.symbol(),
        dsc.address,
        dsc.totalSupply(),
        dsc.balanceOf(accountAddress),
      ]).then((res) => {
        return TOKEN_DATA_KEYS.reduce((prev, curr, index) => {
          return { ...prev, [curr]: res[index] };
        }, INIT_TOKEN_DATA);
      });

      setPair([tokenA, tokenB]);
    })();
  }, [
    accountAddress,
    contractAddresses,
    inverted,
    signer,
    treasuryContractState.contracts,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !treasuryContractState.contracts ||
        !treasuryContractState.contracts.curvePool ||
        Number(amountIn) <= 0
      )
        return;
      const dy = await treasuryContractState.contracts.curvePool.get_dy(
        inverted ? 1 : 0,
        inverted ? 0 : 1,
        getContractReadableAmount(amountIn, 18)
      );
      setAmountOut(getUserReadableAmount(dy, 18).toString());
    })();
  }, [amountIn, inverted, treasuryContractState.contracts]);

  useEffect(() => {
    (async () => {
      if (
        !path[0] ||
        !path[1] ||
        !path[0].address ||
        !signer ||
        !accountAddress ||
        !treasuryContractState.contracts ||
        !treasuryContractState.contracts.curvePool
      )
        return;

      const _token =
        path[0].symbol === 'DSC'
          ? DscToken__factory.connect(path[0].address, signer)
          : MockToken__factory.connect(path[0].address, signer);

      const allowance = await _token.allowance(
        accountAddress,
        treasuryContractState.contracts.curvePool.address
      );

      setApproved(allowance.gte(getContractReadableAmount(amountIn, 18)));
    })();
  }, [accountAddress, amountIn, path, signer, treasuryContractState.contracts]);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Input
          type="number"
          value={amountIn}
          placeholder="0.0"
          className="py-2"
          leftElement={
            <img
              src={`/images/tokens/${path[0]?.symbol.toLowerCase()}.svg`}
              alt={path[0]?.symbol}
              className="w-10 h-10"
            />
          }
          onChange={handleAmountIn}
          bottomElement={
            <div className="flex justify-between">
              <span className="text-sm text-stieglitz">Balance</span>
              <span className="text-sm text-stieglitz">
                {getUserReadableAmount(path[0]?.balance || '0', 18)}
              </span>
            </div>
          }
        />
        <div className="relative bg-cod-gray text-center">
          <button
            className={`absolute -top-4 bg-umbra hover:bg-umbra ${
              inverted ? 'transform rotate-180' : null
            }`}
            onClick={handleInvert}
          >
            <ArrowDownwardRoundedIcon className="w-7 h-7 rounded-full fill-current text-stieglitz border-4 border-cod-gray" />
          </button>
        </div>
        <Input
          type="number"
          value={amountOut}
          placeholder="0.0"
          className="py-2"
          disabled
          sx={{
            '& input.MuiInputBase-input': {
              '-webkit-text-fill-color': '#5D5D5D',
              overflowX: 'true',
              padding: '0',
            },
          }}
          leftElement={
            <img
              src={`/images/tokens/${path[1]?.symbol.toLowerCase()}.svg`}
              alt={path[1]?.symbol}
              className="w-10 h-10"
            />
          }
          bottomElement={
            <div className="flex justify-between">
              <Typography variant="h6" color="stieglitz">
                Balance
              </Typography>
              <Typography variant="h6" color="stieglitz">
                {formatAmount(
                  getUserReadableAmount(path[1]?.balance || '0', 18),
                  3
                )}
              </Typography>
            </div>
          }
        />
      </div>
      <button
        onClick={approved ? handleSwap : handleApprove}
        className={`${
          !Number(amountIn) ? 'bg-umbra cursor-not-allowed' : 'bg-primary'
        } p-2 w-full rounded-md`}
        disabled={!Number(amountIn)}
      >
        <span
          className={`text-sm ${!Number(amountIn) ? 'text-stieglitz' : null}`}
        >
          {approved ? 'Swap' : 'Approve'}
        </span>
      </button>
    </div>
  );
};

export default SwapPanel;

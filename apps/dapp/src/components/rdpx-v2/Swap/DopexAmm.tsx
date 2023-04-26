import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import {
  DopexAMMFactory__factory,
  DopexAMMRouter__factory,
  MockToken,
  MockToken__factory,
} from '@dopex-io/sdk';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import Input from 'components/UI/Input';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

import { CHAIN_ID_TO_EXPLORER, MAX_VALUE } from 'constants/index';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import smartTrim from 'utils/general/smartTrim';
import formatAmount from 'utils/general/formatAmount';

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

const DopexAmm = () => {
  const sendTx = useSendTx();

  const {
    accountAddress,
    signer,
    chainId,
    contractAddresses,
    treasuryContractState,
    treasuryData,
  } = useBoundStore();

  const [pair, setPair] = useState<TokenData[]>([]);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('');
  const [inverted, setInverted] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [reserves, setReserves] = useState<Record<string, number>[]>([
    {
      value: 0,
      percentage: 0,
    },
    {
      value: 0,
      percentage: 0,
    },
  ]);
  const [fee, setFee] = useState<number[]>([0, 0]);

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
      !treasuryContractState.contracts.ammRouter
    )
      return;

    const _tokenContract = MockToken__factory.connect(path[0].address, signer);

    try {
      await sendTx(_tokenContract, 'approve', [
        treasuryContractState.contracts.ammRouter.address,
        MAX_VALUE,
      ]).then(() => {
        setApproved(true);
      });
    } catch (e) {
      console.log(e);
    }
  }, [path, sendTx, signer, treasuryContractState.contracts]);

  const handleSwap = useCallback(async () => {
    if (
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.ammRouter ||
      !signer ||
      !accountAddress ||
      !path[0] ||
      !path[1] ||
      !amountIn ||
      !contractAddresses
    )
      return;

    const router = DopexAMMRouter__factory.connect(
      treasuryContractState.contracts.ammRouter.address,
      signer
    );

    if (!router) return;

    const _path = path.map((path) => path.address);

    const [amountA, amountB] = await router.getAmountsOut(
      getContractReadableAmount(amountIn, 18),
      _path
    );

    if (!amountA || !amountB) return;

    const deadline = Math.floor(new Date().getTime() / 1000) + 60;

    try {
      await sendTx(router, 'swapExactTokensForTokens', [
        getContractReadableAmount(amountIn, 18),
        amountB,
        _path,
        accountAddress,
        deadline,
      ]);
    } catch (e) {
      console.error(e);
    }
  }, [treasuryContractState, path, amountIn]);

  const updatePool = useCallback(async () => {
    if (
      !treasuryContractState.contracts ||
      !contractAddresses['RDPX-V2']['DopexAMMFactory'] ||
      !signer ||
      !accountAddress
    )
      return;

    let [reserveA, reserveB, addressA, addressB]: [
      number | BigNumber,
      number | BigNumber,
      string,
      string
    ] = await treasuryContractState.contracts.treasury.getRdpxAlphaLpReserves();

    const alpha_token: MockToken = MockToken__factory.connect(addressA, signer);

    const rdpx: MockToken = MockToken__factory.connect(addressB, signer);

    const tokenA = await Promise.all([
      alpha_token.symbol(),
      addressA,
      alpha_token.totalSupply(),
      alpha_token.balanceOf(accountAddress),
    ]).then((res) => {
      return TOKEN_DATA_KEYS.reduce((prev, curr, index) => {
        return { ...prev, [curr]: res[index] };
      }, INIT_TOKEN_DATA);
    });

    const tokenB = await Promise.all([
      rdpx.symbol(),
      addressB,
      rdpx.totalSupply(),
      rdpx.balanceOf(accountAddress),
    ]).then((res) => {
      return TOKEN_DATA_KEYS.reduce((prev, curr, index) => {
        return { ...prev, [curr]: res[index] };
      }, INIT_TOKEN_DATA);
    });

    reserveA = getUserReadableAmount(reserveA || 0);
    reserveB = getUserReadableAmount(reserveB || 0);

    if (!reserveA || !reserveB) return;

    const [shareA, shareB] = [
      (reserveA / (reserveA + reserveB)) * 100,
      (reserveB / (reserveA + reserveB)) * 100,
    ];

    const factory = DopexAMMFactory__factory.connect(
      contractAddresses['RDPX-V2']['DopexAMMFactory'],
      signer
    );

    const feeStructure = (
      await factory.getFeeStructure(
        '0x1985Dc434BCDd736E08af1B4e396c7036A2469a6'
      )
    ).map((fee) => fee.toNumber() / 10);

    setReserves([
      { value: reserveA, percentage: shareA },
      { value: reserveB, percentage: shareB },
    ]);
    setPair([tokenA, tokenB]);
    setFee(feeStructure);
  }, [
    treasuryData,
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
        !treasuryContractState.contracts.ammRouter ||
        Number(amountIn) <= 0 ||
        !path[0] ||
        !path[1] ||
        !path[0].address ||
        !path[1].address ||
        !amountIn
      )
        return;

      const _path = path.map((token) => token.address);

      const _amounts: BigNumber[] =
        await treasuryContractState.contracts.ammRouter
          .getAmountsOut(getContractReadableAmount(amountIn, 18), _path)
          .catch(() => [BigNumber.from(0), BigNumber.from(0)]);

      setAmountOut(getUserReadableAmount(_amounts[1]!, 18).toString());
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
        !treasuryContractState.contracts.ammRouter
      )
        return;

      const _token = MockToken__factory.connect(path[0].address, signer);
      const allowance = await _token.allowance(
        accountAddress,
        treasuryContractState.contracts.ammRouter.address
      );

      setApproved(allowance.gte(getContractReadableAmount(amountIn, 18)));
    })();
  }, [accountAddress, amountIn, path, signer, treasuryContractState.contracts]);

  useEffect(() => {
    updatePool();
  }, [updatePool]);

  return (
    <div className="space-y-2 flex flex-col">
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
              <p className="text-sm text-stieglitz">Balance</p>
              <p className="text-sm text-stieglitz">
                {getUserReadableAmount(path[0]?.balance || '0', 18)}
              </p>
            </div>
          }
        />
        <div className="relative bg-cod-gray text-center">
          <button className={`absolute -top-4 bg-umbra`} onClick={handleInvert}>
            <ArrowDownwardRoundedIcon
              className={`w-7 h-7 rounded-full fill-current text-white hover:bg-opacity-80 transition ease-in duration-75 bg-primary border-4 border-cod-gray`}
            />
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
              <p className="text-sm text-stieglitz">Balance</p>
              <p className="text-sm text-stieglitz">
                {getUserReadableAmount(path[1]?.balance || '0', 18)}
              </p>
            </div>
          }
        />
        <div className="bg-umbra py-2 px-3 rounded-xl border border-carbon">
          <span className="underline decoration-dashed text-sm">Pool Data</span>
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">{pair[0]?.symbol}</span>
            <div className="space-x-1">
              <span className="text-sm">
                {formatAmount(reserves[0]?.['value'], 3)}
              </span>
              <span className="text-sm text-stieglitz">
                ({formatAmount(reserves[0]?.['percentage'], 3)}%)
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">{pair[1]?.symbol}</span>
            <div className="space-x-1">
              <span className="text-sm">
                {formatAmount(reserves[1]?.['value'], 3)}
              </span>
              <span className="text-sm text-stieglitz">
                ({formatAmount(reserves[1]?.['percentage'], 3)}%)
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">Swap Fee</span>
            <div>
              <span className="text-sm">
                {`${pair[0]?.symbol}-${pair[1]?.symbol}`}: {fee[0]}%,{' '}
                {`${pair[1]?.symbol}-${pair[0]?.symbol}`}: {fee[1]}%
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">Pool</span>
            <a
              className="text-sm underline"
              href={`${CHAIN_ID_TO_EXPLORER[chainId]}address/${treasuryContractState.contracts?.ammRouter?.address}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {smartTrim(
                treasuryContractState.contracts?.ammRouter?.address || '-',
                10
              )}
            </a>
          </div>
        </div>
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

export default DopexAmm;

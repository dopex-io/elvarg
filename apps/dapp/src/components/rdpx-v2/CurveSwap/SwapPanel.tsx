import { useState, useEffect, useCallback, SetStateAction } from 'react';
import { DscToken, MockToken, MockToken__factory } from '@dopex-io/sdk';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import { Input } from 'components/UI';
import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const SwapPanel = () => {
  const {
    accountAddress,
    signer,
    userAssetBalances,
    contractAddresses,
    treasuryContractState,
  } = useBoundStore();

  const [userDscBalance, setUserDscBalance] = useState(
    getContractReadableAmount(0, 18)
  );

  const [path, setPath] = useState<(DscToken | MockToken)[]>([]);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('');
  const [inverted, setInverted] = useState<boolean>(false);

  const handleAmountIn = useCallback(
    (e: { target: { value: SetStateAction<string> } }) => {
      setAmountIn(e.target.value);
    },
    []
  );

  const handleInvert = useCallback(() => {
    // const [tokenA, tokenB] = path;

    // if (!tokenA || !tokenB) return;

    console.log(path);

    // swap amountIn/amountOut
    const _newAmountOut = amountIn;
    setAmountIn(amountOut);
    setAmountOut(_newAmountOut);
    // setPath([tokenB, tokenA]);

    // swap prices

    setInverted(!inverted);
  }, [amountIn, amountOut, inverted, path]);

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !accountAddress) return;
      const bal = await treasuryContractState.contracts.dsc.balanceOf(
        accountAddress
      );
      setUserDscBalance(bal);
    })();
  }, [accountAddress, treasuryContractState.contracts]);

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !contractAddresses || !signer)
        return;

      const alpha_token = MockToken__factory.connect(
        contractAddresses['WETH'],
        signer
      );

      const dsc: DscToken = treasuryContractState.contracts.dsc;

      const _path = !inverted ? [dsc, alpha_token] : [alpha_token, dsc];

      setPath(_path);
    })();
  }, [contractAddresses, inverted, signer, treasuryContractState.contracts]);

  useEffect(() => {
    (async () => {
      setAmountOut((Number(amountIn) * 0.99).toString());
    })();
  }, [amountIn]);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Input
          type="number"
          value={amountIn}
          placeholder="0.0"
          className="py-2"
          leftElement={
            <img src="/images/tokens/dsc.svg" alt="dsc" className="w-10 h-10" />
          }
          onChange={handleAmountIn}
          bottomElement={
            <div className="flex justify-between">
              <span className="text-sm text-stieglitz">Balance</span>
              <span className="text-sm text-stieglitz">
                {getUserReadableAmount(userDscBalance, 18)}
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
              src="/images/tokens/weth.svg"
              alt="weth"
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
                  getUserReadableAmount(userAssetBalances['WETH'] || 0, 18),
                  3
                )}
              </Typography>
            </div>
          }
        />
      </div>
      {/* <div className="flex flex-col p-2 w-full">
        <div className="flex justify-between">
          <span className="text-sm text-stieglitz">Receive</span>
          <span className="text-sm text-stieglitz">~{amountOut}</span>
        </div>
      </div> */}
      <button
        onClick={() => {}}
        className="bg-umbra p-2 w-full rounded-md cursor-not-allowed"
        // bg-primary
      >
        <span className="text-sm text-stieglitz">Coming soon</span>
      </button>
    </div>
  );
};

export default SwapPanel;

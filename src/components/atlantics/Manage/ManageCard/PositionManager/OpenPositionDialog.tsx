import Dialog from 'components/UI/Dialog';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ERC20__factory } from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import ArrowRightIcon from 'svgs/icons/ArrowRightIcon';
import CustomInput from 'components/UI/CustomInput';
import { Button } from '@mui/material';
import CustomButton from 'components/UI/CustomButton';
import { WalletContext } from 'contexts/Wallet';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import useSendTx from 'hooks/useSendTx';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import { AtlanticsContext } from 'contexts/Atlantics';
import useGmxCalculations from 'hooks/gmx-calculations/useGmxCalculations';
import oneEBigNumber from 'utils/math/oneEBigNumber';

interface IProps {
  isOpen: boolean;
  setClose: () => void;
}

const marks = [
  {
    value: 1.1,
    label: '1.1x',
  },
  {
    value: 2,
    label: '2x',
  },
  {
    value: 3,
    label: '3x',
  },
  {
    value: 4,
    label: '4x',
  },
  {
    value: 5,
    label: '5x',
  },
];

export const OpenPositionDialog = ({ isOpen, setClose }: IProps) => {
  const { signer, accountAddress, provider, contractAddresses, chainId } =
    useContext(WalletContext);
  const { selectedPool } = useContext(AtlanticsContext);
  const [leverage, setLeverage] = useState<number>(1.1);
  const [openTokenSelector, setOpenTokenSelector] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>('USDT');
  const [positionBalance, setPositionBalance] = useState<string>('');

  const tx = useSendTx();
  const { getPositionSize } = useGmxCalculations();

  const allowedTokens = useMemo(() => {
    if (!selectedPool || !contractAddresses || !selectedPool.tokens) return [];
    console.log('contract addresses', contractAddresses['WETH']);
    const tokens = Object.keys(selectedPool.tokens).map((token: string) => {
      return {
        symbol: selectedPool.tokens[token],
        address: contractAddresses[token],
      };
    });
    return tokens;
  }, [selectedPool, contractAddresses]);
  const selectToken = (token: string) => {
    setSelectedToken(() => token);
  };

  const getCosts = useCallback(() => {
    return 'testing';
  }, []);

  console.log(getCosts(), 'DIS DA COSTING');
  function onChangeLeverage(event: Event, value: any, aciveThumb: any) {
    setLeverage(() => value);
  }

  const onEscapePressed = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setClose();
    }
  };

  const handlePositionBalanceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setPositionBalance(value);
  };

  const cost = useMemo(() => {}, []);
  const getPreUseStrategyValues = async () => {};

  const handleMax = useCallback(async () => {
    if (!accountAddress || !selectedToken) return;
    const tokenContract = ERC20__factory.connect(
      contractAddresses[selectedToken],
      provider
    );
    const balance = await tokenContract.balanceOf(accountAddress);
    const tokenDecimals = getTokenDecimals(selectedToken, chainId);
    setPositionBalance(() =>
      String(getUserReadableAmount(balance, tokenDecimals))
    );
  }, [accountAddress, chainId, contractAddresses, provider, selectedToken]);

  const handleApprove = useCallback(async () => {
    if (!signer || !selectedToken) return;
    const strategyContractAddress = contractAddresses[selectedToken];
    const tokenContractAddress = contractAddresses[selectedToken];
    const tokenDecimals = getTokenDecimals(selectedToken, chainId);
    const contractInput = getContractReadableAmount(
      positionBalance,
      tokenDecimals
    );
    const tokenContract = ERC20__factory.connect(tokenContractAddress, signer);
    tx(tokenContract.approve(strategyContractAddress, contractInput));
  }, [signer, selectedToken, contractAddresses, chainId, tx, positionBalance]);

  const handleLong = () => {};

  return (
    <Dialog open={isOpen} onKeyPress={onEscapePressed}>
      <Box className="flex flex-row justify-center items-center mb-5">
        <Typography className="w-full text-center" variant="h4">
          Open Long Position
        </Typography>
        <Box onClick={setClose} className=" flex flex-row-reverse">
          <ArrowRightIcon fill="white" className="cursor-pointer" />
        </Box>
      </Box>

      <CustomInput
        size="small"
        variant="outlined"
        outline="umbra"
        value={positionBalance}
        onChange={handlePositionBalanceChange}
        leftElement={
          <Box className="flex h-full my-auto">
            <Box
              className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1"
              role="button"
              onClick={() => setOpenTokenSelector(() => true)}
            >
              <img
                src={`/images/tokens/${selectedToken}.svg`}
                alt={selectedToken}
                className="w-[2.4rem]"
              />
              <Typography variant="h5" className="my-auto">
                {selectedToken}
              </Typography>
            </Box>
            <Button
              className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
              onClick={handleMax}
            >
              <Typography variant="h6" className="text-xs" color="stieglitz">
                MAX
              </Typography>
            </Button>
          </Box>
        }
      />
      <TokenSelector
        setSelection={selectToken}
        open={openTokenSelector}
        setOpen={setOpenTokenSelector}
        tokens={[
          { symbol: 'USDT', address: '' },
          { symbol: 'WETH', address: '' },
        ]}
      />
      <Box className="flex p-3 flex-col">
        <Box className="flex flex-col items-center">
          <Typography
            variant="h6"
            className="text-left w-full"
            color="stieglitz"
          >
            Leverage
          </Typography>
          <Slider
            sx={{
              '.MuiSlider-markLabel': {
                color: 'gray',
              },
            }}
            className="w-[20rem]"
            color="primary"
            aria-label="Small steps"
            defaultValue={1.1}
            onChange={onChangeLeverage}
            step={0.1}
            min={1.1}
            max={5}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Box>
        <Box className="flex flex-row bg-umbra justify-between w-full items-center mt-2 p-2 rounded-md">
          <Typography variant="h6" color="stieglitz">
            Index token
          </Typography>
          <Box className="flex justify-center items-center">
            <Typography variant="h6" className="mr-3">
              ETH
            </Typography>

            <img
              src={`/images/tokens/${'WETH'}.svg`}
              alt={'WETH'}
              className="w-[2.4rem]"
            />
          </Box>
        </Box>
        <CustomButton className="mt-5">Long</CustomButton>
      </Box>
    </Dialog>
  );
};

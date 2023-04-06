import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ERC20__factory } from '@dopex-io/sdk';

import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

import TokenSelector from '../TokenSelector';

import { useBoundStore } from 'store';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount, getTokenDecimals } from 'utils/general';

interface IOverrides {
  setTokenSelectorOpen?: Dispatch<React.SetStateAction<boolean>>;
}

interface IInputWithTokenSelectorProps {
  selectedTokenSymbol: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
  handleMax: () => void;
  handleInputAmountChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputAmount: string | number;
  topLeftTag?: string;
  topRightTag?: string;
  overrides?: IOverrides;
}

const InputWithTokenSelector = (props: IInputWithTokenSelectorProps) => {
  const {
    inputAmount,
    handleInputAmountChange,
    setSelectedToken,
    selectedTokenSymbol,
    topLeftTag,
    topRightTag,
    overrides,
    handleMax,
  } = props;

  const { chainId, getContractAddress, provider, accountAddress } =
    useBoundStore();

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState('0');

  const updateUserBalance = useCallback(async () => {
    if (!provider || !accountAddress) return;

    const tokenAddress = getContractAddress(selectedTokenSymbol.toUpperCase());

    if (!tokenAddress) return;

    const token = ERC20__factory.connect(tokenAddress, provider);

    setSelectedTokenBalance(
      formatAmount(
        getUserReadableAmount(
          await token.balanceOf(accountAddress),
          getTokenDecimals(selectedTokenSymbol, chainId)
        ),
        3
      )
    );
  }, [
    accountAddress,
    chainId,
    provider,
    selectedTokenSymbol,
    getContractAddress,
  ]);

  useEffect(() => {
    updateUserBalance();
  }, [updateUserBalance]);

  const handleTokenSelectorClick = useCallback(() => {
    if (chainId === 137) return;
    setTokenSelectorOpen((prev) => !prev);

    // overrides
    overrides?.setTokenSelectorOpen &&
      overrides?.setTokenSelectorOpen((prev) => !prev);
  }, [overrides, chainId]);

  return (
    <Box className="bg-umbra rounded-md">
      <Input
        size="small"
        variant="default"
        type="number"
        placeholder="0.0"
        value={inputAmount}
        onChange={handleInputAmountChange}
        topElement={
          <Box className="flex mb-2">
            <Typography
              variant="h6"
              className="text-left flex-1 text-stieglitz"
            >
              {topLeftTag}
            </Typography>
            <Typography
              variant="h6"
              className="text-right flex-1 text-stieglitz"
            >
              {topRightTag}
            </Typography>
          </Box>
        }
        leftElement={
          <Box className="flex my-auto w-full space-x-2">
            <Box
              className="flex w-fit bg-cod-gray rounded-md justify-content items-center space-x-2 py-2 px-2"
              role={`${chainId === 137 ? 'Box' : 'Button'}`}
              onClick={handleTokenSelectorClick}
            >
              <img
                src={`/images/tokens/${selectedTokenSymbol.toLowerCase()}.svg`}
                alt={selectedTokenSymbol}
                className="w-[2rem]"
              />
              <Typography variant="h6" className="my-auto">
                {selectedTokenSymbol}
              </Typography>{' '}
              {chainId !== 137 &&
                (tokenSelectorOpen ? (
                  <KeyboardArrowUpIcon className="text-white" />
                ) : (
                  <KeyboardArrowDownIcon className="text-white" />
                ))}
            </Box>
          </Box>
        }
        bottomElement={
          <Box className="flex w-full mt-2">
            <Typography
              className=" text-left flex-1 text-stieglitz"
              variant="h6"
            >
              Balance
            </Typography>
            <Typography
              className="text-right flex-1 text-stieglitz underline cursor-pointer"
              variant="h6"
              onClick={handleMax}
            >
              {selectedTokenBalance}
            </Typography>
          </Box>
        }
      />
      {tokenSelectorOpen && (
        <TokenSelector
          open={tokenSelectorOpen}
          setOpen={handleTokenSelectorClick}
          setFromTokenSymbol={setSelectedToken}
          isInDialog={false}
          tokensToExclude={['ETH']}
        />
      )}
    </Box>
  );
};

export default InputWithTokenSelector;

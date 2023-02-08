import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Box from '@mui/material/Box';

import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';
import TokenSelector from '../TokenSelector';

import { useBoundStore } from 'store';
import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount, getTokenDecimals } from 'utils/general';

interface IOverrides {
  setTokenSelectorOpen: Dispatch<React.SetStateAction<boolean>>;
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
  } = props;

  const { chainId, userAssetBalances } = useBoundStore();

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState('0');

  useEffect(() => {
    if (!selectedTokenSymbol) return;

    const assetBalance = userAssetBalances[selectedTokenSymbol];

    if (!assetBalance) return;

    setSelectedTokenBalance(assetBalance);
  }, [userAssetBalances, selectedTokenBalance, selectedTokenSymbol]);

  const information = useMemo(() => {
    let defaultInfo = {
      selectedTokenBalance: '0',
    };
    if (!chainId || !selectedTokenBalance) return;
    defaultInfo.selectedTokenBalance = formatAmount(
      getUserReadableAmount(
        selectedTokenBalance,
        getTokenDecimals(selectedTokenSymbol, chainId)
      ),
      5
    );

    return defaultInfo;
  }, [chainId, selectedTokenBalance, selectedTokenSymbol]);

  const handleTokenSelectorClick = useCallback(() => {
    setTokenSelectorOpen((prev) => !prev);

    // overrides
    overrides?.setTokenSelectorOpen((prev) => !prev);
  }, [overrides]);

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
              className="flex w-fit bg-cod-gray rounded-full space-x-2 py-2 border border-gray-800"
              role="button"
              onClick={handleTokenSelectorClick}
            >
              <img
                src={`/images/tokens/${selectedTokenSymbol.toLowerCase()}.svg`}
                alt={selectedTokenSymbol}
                className="w-[2rem]"
              />
              <Typography variant="h6" className="my-auto">
                {selectedTokenSymbol}
              </Typography>
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
              className=" text-right flex-1 text-stieglitz"
              variant="h6"
            >
              {information?.selectedTokenBalance}
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
          tokensToExclude={[]}
        />
      )}
    </Box>
  );
};

export default InputWithTokenSelector;

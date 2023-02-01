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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';
import TokenSelector from '../TokenSelector';

import { useBoundStore } from 'store';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import { getUserReadableAmount } from 'utils/contracts';
import { getTokenDecimals } from 'utils/general';

/**
 * React.useStates required from parent component:
 * 1.selectedTokenSymbol - Symbol of the token selected from the token selector
 * 2.setSelectedToken - Setter for the symbol once the token is selected from the token selector.
 * 3.inputAmount - Amount entered in the input area. Only BigNumberish
 * 4.setInputAmount - Setter for the input amount entered.
 */

interface IInputWithTokenSelectorProps {
  selectedTokenSymbol: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
  handleMax: () => void;
  handleInputAmountChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputAmount: string | number;
  overrides?: IInputWithTokenSelectorOverridesProps;
  setInputAmount: Dispatch<React.SetStateAction<string | number>>;
}

interface IInputWithTokenSelectorOverridesProps {
  disableTokenSelector: boolean;
  disableInputField: boolean;
}

const InputWithTokenSelector = (props: IInputWithTokenSelectorProps) => {
  const {
    inputAmount,
    setInputAmount,
    handleInputAmountChange,
    setSelectedToken,
    selectedTokenSymbol,
  } = props;

  const { accountAddress, signer, contractAddresses, chainId } =
    useBoundStore();

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState('0');

  useEffect(() => {
    (async function () {
      if (!accountAddress || !signer || !contractAddresses) return;
      const bal = await ERC20__factory.connect(
        contractAddresses[selectedTokenSymbol],
        signer
      ).balanceOf(accountAddress);
      setSelectedTokenBalance(bal.toString());
    })();
  }, [accountAddress, signer, contractAddresses, selectedTokenSymbol]);

  const information = useMemo(() => {
    let defaultInfo = {
      selectedTokenBalance: 0,
    };
    if (!chainId || !selectedTokenBalance) return;
    defaultInfo.selectedTokenBalance = getUserReadableAmount(
      selectedTokenBalance,
      getTokenDecimals(selectedTokenSymbol, chainId)
    );

    return defaultInfo;
  }, [chainId, selectedTokenBalance, selectedTokenSymbol]);

  const handleMax = useCallback(() => {
    if (!information) return;
    setInputAmount(information.selectedTokenBalance);
  }, [setInputAmount, information]);

  return (
    <Box className="bg-umbra rounded-md py-[1rem]">
      <Input
        size="small"
        variant="default"
        type="number"
        placeholder="0.0"
        value={inputAmount}
        onChange={handleInputAmountChange}
        leftElement={
          <Box className="flex my-auto space-x-2">
            <Box
              className="flex w-full bg-cod-gray rounded-full space-x-2 pr-3 p-2 border border-gray-800"
              role="button"
              onClick={() => setTokenSelectorOpen(() => true)}
            >
              {' '}
              <img
                src={`/images/tokens/${selectedTokenSymbol.toLowerCase()}.svg`}
                alt={selectedTokenSymbol}
                className="w-[2rem]"
              />
              <Typography variant="h6" className="my-auto">
                {selectedTokenSymbol}
              </Typography>
              <KeyboardArrowDownRoundedIcon className="fill-current text-mineshaft my-auto" />
            </Box>
            <Box
              role="button"
              className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
              onClick={handleMax}
            >
              <Typography variant="caption" color="stieglitz">
                MAX
              </Typography>
            </Box>
          </Box>
        }
      />
      {tokenSelectorOpen && (
        <TokenSelector
          open={tokenSelectorOpen}
          setOpen={setTokenSelectorOpen}
          setFromTokenSymbol={setSelectedToken}
          isInDialog={false}
          tokensToExclude={[]}
        />
      )}
      <Box className="flex w-full">
        <Typography className="pl-[1.5rem] text-left flex-1" variant="h6">
          Balance
        </Typography>
        <Typography className="pr-[1rem] text-right flex-1" variant="h6">
          {information?.selectedTokenBalance}
        </Typography>
      </Box>
    </Box>
  );
};

export default InputWithTokenSelector;

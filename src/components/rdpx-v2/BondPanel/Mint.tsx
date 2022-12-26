import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import { TOKEN_DECIMALS } from 'constants/index';

const Mint = () => {
  const { chainId, userAssetBalances } = useBoundStore();

  const [value, setValue] = useState<number | string>('');

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleMax = useCallback(() => {
    // if (!atlanticPool) return;
    // const { depositToken } = atlanticPool?.tokens;
    // if (!depositToken) return;
    setValue(
      getUserReadableAmount(
        userAssetBalances['USDC'] ?? '0',
        getTokenDecimals('USDC', chainId)
      )
    );
  }, [chainId, userAssetBalances]);

  return (
    <Box className="space-y-3">
      <Box className="bg-umbra rounded-xl w-full">
        <Input
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className="flex w-full"
          leftElement={
            <Box className="flex my-auto space-x-2">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[30px] h-[30px]"
              />
              <Box
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Mint
          </Typography>
          <Typography variant="h6">
            {formatAmount(
              getUserReadableAmount(
                userAssetBalances['USDC'] ?? '0',
                TOKEN_DECIMALS[chainId]?.['USDC']
              ),
              3,
              true
            )}{' '}
            {'DSC'}
          </Typography>
        </Box>
      </Box>
      <Box className="rounded-xl p-4 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <Box className="flex justify-between">
            <Typography variant="h6" color="stieglitz">
              Receive
            </Typography>
            <Box className="flex my-auto space-x-2">
              <Typography variant="h6" color="stieglitz">
                {'-'}
              </Typography>
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[1rem] my-auto"
              />
            </Box>
          </Box>
        </Box>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={'mineshaft'}
          disabled={true}
          onClick={() => {}}
        >
          Deposit
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Mint;

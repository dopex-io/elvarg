import { useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';

import { FarmingContext } from 'contexts/Farming';

import Typography from 'components/UI/Typography';

interface LpTokenDistributionProps {
  stakingAsset: string;
  value?: number;
  className?: string;
  layout?: 'row' | 'col';
}

const LpTokenDistribution = ({
  stakingAsset,
  value = 0,
  className,
  layout = 'col',
}: LpTokenDistributionProps) => {
  const { DPX_WETHToken, rDPX_WETHToken } = useContext(FarmingContext);

  const { token, tokenValue, ethValue } = useMemo(() => {
    if (stakingAsset === 'DPX-WETH' && DPX_WETHToken.DpxPerLp) {
      return {
        token: 'DPX',
        tokenValue: Number((DPX_WETHToken.DpxPerLp / 10 ** 6) * value).toFixed(
          2
        ),
        ethValue: (Number(DPX_WETHToken.EthPerLp / 10 ** 6) * value).toFixed(2),
      };
    } else if (stakingAsset === 'rDPX-WETH' && rDPX_WETHToken.rDpxPerLp) {
      return {
        token: 'rDPX',
        tokenValue: Number(
          (rDPX_WETHToken.rDpxPerLp / 10 ** 6) * value
        ).toFixed(2),
        ethValue: (Number(rDPX_WETHToken.EthPerLp / 10 ** 6) * value).toFixed(
          2
        ),
      };
    } else {
      return {
        token: stakingAsset === 'DPX-WETH' ? 'DPX' : 'rDPX',
        tokenValue: 0,
        ethValue: 0,
      };
    }
  }, [DPX_WETHToken, rDPX_WETHToken, value, stakingAsset]);

  if (stakingAsset === 'DPX' || stakingAsset === 'RDPX') return null;

  return (
    <Box
      className={cx(
        'flex',
        layout === 'row'
          ? 'flew-row justify-between mt-2 mb-2 w-full space-x-2'
          : 'flex-col',
        className
      )}
    >
      <Box className="flex flex-1 flex-col-reverse">
        <Typography variant="h6">
          <span className="text-stieglitz mr-1">{token}</span>
        </Typography>
        <Typography variant="h4">{tokenValue}</Typography>
      </Box>
      <Box className="flex flex-1 flex-col-reverse">
        <Typography variant="h6">
          <span className="text-stieglitz mr-1">ETH</span>
        </Typography>
        <Typography variant="h4">{ethValue}</Typography>
      </Box>
    </Box>
  );
};

export default LpTokenDistribution;

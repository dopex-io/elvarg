import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import formatAmount from 'utils/general/formatAmount';
import { Typography } from 'components/UI';
import InfoBox from 'components/common/LpCommon/InfoBox';
import { getUpperLowerStep } from './helper';
import StrikeSlider from './StrikeSlider';

interface Props {
  nearestValidPrice: number;
  rawStrike: string;
  handleInputChange: any;
}

const StrikeBox = ({
  nearestValidPrice,
  rawStrike,
  handleInputChange,
}: Props) => {
  const [upper, lower, step] = getUpperLowerStep(nearestValidPrice);

  const [nonZeroUpper, setNonZeroUpper] = useState<number>(0);
  useEffect(() => {
    if (upper === undefined) return;
    if (upper !== 0) {
      setNonZeroUpper(upper);
    }
  }, [upper]);

  return (
    <Box>
      <Box
        className={`flex flex-row h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 items-center`}
      >
        <Box className="flex flex-row h-10 p-1 w-64 mb-1.5">
          <InfoBox
            heading={'Strike'}
            tooltip={`You will sell [strike × amount] USDC or underlying worth of put options at [strike]`}
          />
        </Box>
        <Typography variant="h5" className="pl-1 pt-2 mb-2">
          {rawStrike === '0' || upper === 0
            ? '-'
            : `$${formatAmount(Number(rawStrike), 2)}`}
        </Typography>
      </Box>

      <StrikeSlider
        upper={nonZeroUpper}
        lower={lower!}
        step={step!}
        handleInputChange={handleInputChange}
      />

      <Box className="h-24 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 mb-2">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">
            Strike must be lower than the current price
          </span>
        </Typography>
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">
            {`For $10 < strike < $1,000 must be in $5 increment, for $1,000 < strike < $10,000 must be in $50 increment, etc.`}
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default StrikeBox;

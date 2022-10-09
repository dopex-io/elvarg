import { Box } from '@mui/material';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';

function valuetext(value: number) {
  return `$${-1 * value}`;
}

interface Props {
  upper: number;
  lower: number;
  step: number;
  handleInputChange: any;
}

const StrikeSlider = (props: Props) => {
  const { upper, lower, step, handleInputChange } = props;

  if (upper === undefined || upper === 0) {
    return (
      <Box className="flex items-center justify-items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="pl-12">
      <Box sx={{ width: 200 }}>
        <Slider
          aria-label="Always visible"
          valueLabelFormat={valuetext}
          defaultValue={-upper!}
          min={-upper!}
          max={-lower!}
          step={step!}
          isRtl={false}
          onChange={handleInputChange}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default StrikeSlider;

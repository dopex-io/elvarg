import { useCallback, useMemo } from 'react';
import range from 'lodash/range';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

interface EpochSelectorProps {
  currentEpoch: number;
  selectedEpoch: number;
  setSelectedEpoch: Function;
}

const EpochSelector = (props: EpochSelectorProps) => {
  const { currentEpoch, selectedEpoch, setSelectedEpoch } = props;

  const epochs = useMemo(() => {
    return range(currentEpoch)
      .join()
      .split(',')
      .map((_i, index) => {
        return (
          <MenuItem value={index + 1} key={index} className="text-stieglitz">
            {`${index + 1}${
              index + 1 === range(currentEpoch).length ? '*' : ''
            }`}
          </MenuItem>
        );
      });
  }, [currentEpoch]);

  const handleEpochSelection = useCallback(
    (e: any) => {
      console.log(e.target.value);
      setSelectedEpoch(Number(e.target.value));
    },
    [setSelectedEpoch]
  );

  return (
    <Select
      value={selectedEpoch}
      onChange={handleEpochSelection}
      className="h-full bg-gradient-to-r from-primary to-wave-blue rounded-lg text-center font-semibold my-auto text-white"
      MenuProps={{
        classes: { paper: 'bg-umbra' },
      }}
      classes={{ icon: 'text-white' }}
      placeholder={'-'}
    >
      {epochs}
    </Select>
  );
};

export default EpochSelector;

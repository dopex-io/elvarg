import { useCallback, useMemo } from 'react';
import range from 'lodash/range';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useBoundStore } from 'store';

interface EpochSelectorProps {
  currentEpoch: number;
  selectedEpoch: number;
  setSelectedEpoch: Function;
}

const EpochSelector = (props: EpochSelectorProps) => {
  const { currentEpoch, selectedEpoch, setSelectedEpoch } = props;

  const { updateAtlanticPoolEpochData } = useBoundStore();

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
    (e: { target: { value: string | number } }) => {
      setSelectedEpoch(Number(e.target.value));
      updateAtlanticPoolEpochData();
    },
    [setSelectedEpoch, updateAtlanticPoolEpochData]
  );

  return (
    <Select
      value={selectedEpoch}
      onChange={handleEpochSelection}
      className="bg-gradient-to-r from-primary to-wave-blue rounded-lg text-center font-semibold text-white"
      MenuProps={{
        classes: { paper: 'bg-umbra' },
      }}
      classes={{ icon: 'text-white', select: 'px-3' }}
      placeholder={'-'}
      variant="standard"
      disableUnderline
    >
      {epochs}
    </Select>
  );
};

export default EpochSelector;

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

  const { updateAtlanticPoolEpochData, updateAtlanticPool } = useBoundStore();

  const epochs = useMemo(() => {
    return range(2)
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
      if (Number(e.target.value) == 1) {
        updateAtlanticPool('WETH', 'WEEKLY', true);
      } else {
        updateAtlanticPool('WETH', 'WEEKLY');
      }
      updateAtlanticPoolEpochData();
    },
    [setSelectedEpoch, updateAtlanticPoolEpochData, updateAtlanticPool]
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

import { useCallback, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import cx from 'classnames';

import { SsovProperties } from 'contexts/Ssov';

export default function EpochSelector({
  className,
  ssovProperties,
}: {
  className?: string;
  ssovProperties: SsovProperties;
}) {
  const { currentEpoch, selectedEpoch, setSelectedEpoch } = ssovProperties;

  const handleSelectChange = useCallback(
    (e) => {
      setSelectedEpoch(Number(e.target.value));
    },
    [setSelectedEpoch]
  );

  const epochs = useMemo(
    () =>
      Array(currentEpoch)
        .join()
        .split(',')
        .map((_i, index) => {
          return (
            <MenuItem
              value={index + 1}
              key={index + 1}
              className="text-white"
              disabled={index + 1 === currentEpoch}
            >
              Epoch {index + 1} {currentEpoch === index + 1 ? '(Current)' : ''}
            </MenuItem>
          );
        }),
    [currentEpoch]
  );

  if (!currentEpoch || !selectedEpoch) return <></>;

  return (
    <Box className={cx('', className)}>
      <FormControl>
        <Box className="text-white">
          <Select
            value={selectedEpoch}
            onChange={handleSelectChange}
            className="text-white bg-umbra px-3 py-1 rounded-lg"
            MenuProps={{
              classes: { paper: 'bg-umbra' },
            }}
            disableUnderline
            classes={{ icon: 'text-white' }}
            placeholder={'Select epoch'}
          >
            {epochs}
          </Select>
        </Box>
      </FormControl>
    </Box>
  );
}

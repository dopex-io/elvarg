import { useCallback, useMemo, useContext } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import cx from 'classnames';

import { SsovContext } from 'contexts/Ssov';

export default function EpochSelector({ className }: { className?: string }) {
  const { selectedEpoch, setSelectedEpoch, ssovData } = useContext(SsovContext);

  const { currentEpoch } = ssovData;

  const handleSelectChange = useCallback(
    (e) => {
      setSelectedEpoch(Number(e.target.value));
    },
    [setSelectedEpoch]
  );

  const epochs = useMemo(() => {
    let _epoch = currentEpoch;

    if (ssovData.isCurrentEpochExpired) {
      _epoch += 1;
    }

    return Array(_epoch)
      .join()
      .split(',')
      .map((_i, index) => {
        return (
          <MenuItem value={index + 1} key={index + 1} className="text-white">
            Epoch {index + 1} {currentEpoch === index + 1 ? '(Current)' : ''}
          </MenuItem>
        );
      });
  }, [currentEpoch, ssovData]);

  if (!currentEpoch || !selectedEpoch) return <></>;

  return (
    <Box className={cx('', className)}>
      <FormControl>
        <Box className="text-white">
          <Select
            value={selectedEpoch}
            onChange={handleSelectChange}
            className="text-white bg-umbra p-0 rounded-lg"
            MenuProps={{
              classes: { paper: 'bg-umbra' },
            }}
            disableUnderline
            classes={{ icon: 'text-white', select: 'px-3 py-2' }}
            placeholder={'Select epoch'}
          >
            {epochs}
          </Select>
        </Box>
      </FormControl>
    </Box>
  );
}

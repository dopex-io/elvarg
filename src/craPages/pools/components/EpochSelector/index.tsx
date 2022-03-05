import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import cx from 'classnames';

import { PoolsContext } from 'contexts/Pools';

export default function EpochSelector({ className }: { className?: string }) {
  const { currentEpoch, selectedEpoch, setSelectedEpoch } =
    useContext(PoolsContext);
  const [showCustomEpochField, setShowCustomEpochField] = useState(false);

  const handleSelectChange = (e) => {
    if (e.target.value === 'custom') {
      setShowCustomEpochField(true);
    } else {
      setShowCustomEpochField(false);
      setSelectedEpoch(Number(e.target.value));
    }
  };

  const handleInputChange = (e) => {
    setSelectedEpoch(Number(e.target.value));
  };

  const epochs = Array(currentEpoch + 1)
    .join()
    .split(',')
    .map((_i, index) => {
      return (
        <MenuItem value={index + 1} key={index + 1} className="text-white">
          Epoch {index + 1} {currentEpoch === index + 1 ? '(Current)' : ''}{' '}
          {currentEpoch + 1 === index + 1 ? '(Next)' : ''}
        </MenuItem>
      );
    });

  return (
    <Box className={cx('', className)}>
      <FormControl>
        <Box className="text-white">
          <Select
            value={showCustomEpochField ? 'custom' : selectedEpoch}
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
            {/* <MenuItem value="custom">Custom Epoch</MenuItem> */}
          </Select>
          {showCustomEpochField ? (
            <TextField
              onChange={handleInputChange}
              className="epoch-selector-fields-text bg-stieglitz rounded-lg p-1"
              placeholder="Type a Custom Epoch"
              type="number"
            />
          ) : null}
        </Box>
      </FormControl>
    </Box>
  );
}

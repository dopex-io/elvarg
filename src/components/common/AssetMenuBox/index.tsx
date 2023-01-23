import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Typography from 'components/UI/Typography';

interface Props {
  assetIdx: number;
  handleSelectAsset: any;
  assets: string[];
}

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 150,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
  disableScrollLock: true,
};

const AssetMenuBox = ({ assetIdx, handleSelectAsset, assets }: Props) => {
  return (
    <Box className="h-[2rem] p-1 w-[7.5rem]">
      <Select
        className="opacity-80 rounded-md text-center bottom-3 -left-2"
        fullWidth
        value={assetIdx}
        onChange={handleSelectAsset}
        input={<Input />}
        variant="outlined"
        placeholder="Select asset"
        MenuProps={SelectMenuProps}
        classes={{
          icon: '-right-1 text-mineshaft text-3xl',
        }}
        disableUnderline
        autoWidth
      >
        {assets.map((asset: string, index: number) => (
          <MenuItem key={index} value={index} className="text-center">
            <Box className="flex p-1">
              <img
                src={`/images/tokens/${asset}.svg`}
                alt={`${asset?.toUpperCase()}`}
                className="h-8"
              />
              <Typography
                variant="h5"
                color="text-white"
                className="text-left w-full ml-2 my-auto"
              >
                <span className="text-white">{asset?.toUpperCase()}</span>
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default AssetMenuBox;

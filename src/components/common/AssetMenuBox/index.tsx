import { Typography } from 'components/UI';
import { Box, Input, Select, MenuItem } from '@mui/material';

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
    <Box className="w-32 -ml-6 -mt-1.5 h-10 p-1">
      <Select
        className="opacity-80 rounded-md text-center"
        fullWidth
        value={assetIdx}
        onChange={handleSelectAsset}
        input={<Input />}
        variant="outlined"
        placeholder="Select asset"
        MenuProps={SelectMenuProps}
        classes={{
          icon: 'absolute right-1 text-mineshaft',
        }}
        disableUnderline
        autoWidth
      >
        {assets.map((asset: string, index: number) => (
          <MenuItem key={index} value={index} className="text-center">
            <Box className="flex flex-row h-10 w-[105px] p-1 ml-1">
              <img
                src={`/images/tokens/${asset}.svg`}
                alt={`${asset?.toUpperCase()}`}
              />
              <Typography
                variant="h5"
                color="text-white"
                className="text-left w-full relative ml-2 mt-1"
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

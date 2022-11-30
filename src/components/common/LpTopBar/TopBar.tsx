import React from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Typography } from 'components/UI';
import { getValueColorClass } from 'utils/general';
import { BigNumber } from 'ethers';
import { getReadableTime } from 'utils/contracts';

function SsovDropdown({
  items,
  setItemIndex,
}: {
  items: BigNumber[];
  setItemIndex: (value: number) => void;
  indent?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  return (
    <React.Fragment>
      <IconButton
        sx={{
          padding: '0px',
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          sx={{
            backgroundColor: 'mineshaft',
            padding: '0px',
            width: '20px',
            height: '20px',
          }}
        >
          {anchorEl ? (
            <ArrowDropUpIcon
              sx={{
                color: 'black',
              }}
            />
          ) : (
            <ArrowDropDownIcon
              sx={{
                color: 'black',
              }}
            />
          )}
        </Avatar>
      </IconButton>
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#1E1E1E',
            minWidth: '16rem',
            marginTop: '1rem',
          },
          '& .MuiMenuItem-root': {
            color: 'white',
            fontSize: '14px',
            '&:hover': {
              color: 'white',
              textDecoration: 'underline',
              cursor: 'pointer',
            },
            marginLeft: '-0.25rem',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {items?.map((item, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              setItemIndex(idx);
              setAnchorEl(null);
            }}
          >
            {getReadableTime(item)}
          </MenuItem>
        ))}
      </MuiMenu>
    </React.Fragment>
  );
}

export function ExpiryBox({
  items,
  itemIndex,
  setItemIndex,
}: {
  items: BigNumber[];
  itemIndex: number;
  setItemIndex: (value: number) => void;
}) {
  return (
    <React.Fragment>
      <Box className="flex flex-row justify-between p-2">
        <Box className="flex flex-row">
          <Box>
            <Typography variant="h6">
              {getReadableTime(
                items ? items[itemIndex ?? '0']! : BigNumber.from(0)
              )}
            </Typography>
            <Typography color="stieglitz" variant="h6">
              SSOV Expiry
            </Typography>
          </Box>
        </Box>
        <SsovDropdown items={items} setItemIndex={setItemIndex} />
      </Box>
    </React.Fragment>
  );
}

export function PriceBox({ price, delta }: { price: number; delta: number }) {
  return (
    <React.Fragment>
      <Box className="w-1/4 flex flex-row justify-between p-2">
        <Box className="flex flex-row">
          <Box>
            <Typography variant="h6">{`$${price}`}</Typography>
            <Typography color="stieglitz" variant="h6">
              Price
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" className={getValueColorClass(delta)}>
            {`${delta}%`}
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
}

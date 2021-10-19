import { useState, MouseEvent } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Typography from 'components/UI/Typography';

import { greekColumns } from './columns';

import { GREEK_SYMBOLS } from 'constants/index';

const GreeksFilter = ({ greeksToShow, handleChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Typography
        variant="h5"
        component="div"
        aria-controls="greeks-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="hidden lg:block"
      >
        Greeks <ExpandMoreIcon className="w-4" />
      </Typography>
      <Menu
        id="greeks-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={{ paper: 'bg-cod-gray' }}
      >
        {Object.keys(greekColumns).map((greek) => {
          return (
            <MenuItem
              className="capitalize text-white cursor-default"
              key={greek}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={greeksToShow[greek]}
                    name={greek}
                    onChange={handleChange}
                    color="default"
                    className="text-white"
                  />
                }
                label={`${greek} ${GREEK_SYMBOLS[greek]}`}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default GreeksFilter;

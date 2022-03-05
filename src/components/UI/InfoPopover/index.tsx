import { useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';

import Typography from '../Typography';

const PREFIX = 'InfoPopover';

const classes = {
  popover: `${PREFIX}-popover`,
  paper: `${PREFIX}-paper`,
};

const StyledPopover = styled(Popover)(({ theme }) => ({
  [`& .${classes.popover}`]: {
    pointerEvents: 'none',
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(1),
    width: 300,
  },
}));

interface Props {
  id: string;
  infoText: string;
  className?: string;
  triggerText?: string;
}

const InfoPopover = ({ className, id, infoText, triggerText }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handlePopoverClose = useCallback(() => setAnchorEl(null), []);

  const popoverOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  return (
    <Box className={className}>
      <Typography
        aria-owns={popoverOpen ? id : undefined}
        aria-haspopup="true"
        variant="h5"
        component="div"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {triggerText} <InfoIcon className="w-5 h-5 mb-1" />
      </Typography>
      <StyledPopover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="h5" component="div" className="text-umbra">
          {infoText}
        </Typography>
      </StyledPopover>
    </Box>
  );
};

export default InfoPopover;

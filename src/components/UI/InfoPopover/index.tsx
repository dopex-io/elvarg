import { useCallback, useMemo, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

import Typography from '../Typography';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
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

  const classes = useStyles();

  const popoverClasses = useMemo(
    () => ({
      paper: classes.paper,
    }),
    [classes.paper]
  );

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
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        className={classes.popover}
        classes={popoverClasses}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="h5" component="div" className="text-umbra">
          {infoText}
        </Typography>
      </Popover>
    </Box>
  );
};

export default InfoPopover;

import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiSwitch from '@material-ui/core/Switch';

const Switch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 40,
      height: 20,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 1,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(20px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 18,
      height: 18,
      boxShadow: 'none',
    },
    track: {
      borderRadius: 10,
      opacity: 1,
      backgroundColor: '#3E3E3E',
    },
    checked: {},
  })
)(MuiSwitch);

export default Switch;

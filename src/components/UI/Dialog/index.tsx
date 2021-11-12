import MaterialDialog, {
  DialogProps as MaterialDialogProps,
} from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  backDrop: {
    backdropFilter: 'blur(15px)',
    background:
      'radial-gradient(circle, rgba(0,46,255,0.2) 0%, rgba(252,70,107,0) 100%)',
  },
}));

interface Props extends MaterialDialogProps {
  width?: number;
  showCloseIcon?: boolean;
  handleClose?: () => void;
}

const Dialog = ({
  classes,
  children,
  handleClose,
  showCloseIcon = false,
  width,
  ...props
}: Props) => {
  const { backDrop } = useStyles();

  return (
    <MaterialDialog
      {...props}
      classes={{
        ...classes,
        root: backDrop,
        paper: 'bg-cod-gray rounded-2xl p-4',
      }}
      PaperProps={{ style: { width: width || 400 } }}
      onClose={handleClose}
    >
      {showCloseIcon ? (
        <IconButton
          aria-label="close"
          className="absolute text-white right-0 top-1"
          onClick={handleClose}
        >
          <CloseIcon className="fill-current text-stieglitz" />
        </IconButton>
      ) : null}
      {children}
    </MaterialDialog>
  );
};

export default Dialog;

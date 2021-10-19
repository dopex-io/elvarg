import cx from 'classnames';
import MaterialDialog, {
  DialogProps as MaterialDialogProps,
} from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import styles from './styles.module.scss';

interface Props extends MaterialDialogProps {
  showCloseIcon?: boolean;
  handleClose?: () => void;
}

const Dialog = ({
  classes,
  children,
  handleClose,
  showCloseIcon = false,
  ...props
}: Props) => {
  return (
    <MaterialDialog
      {...props}
      classes={{
        ...classes,
        paper: cx('bg-cod-gray rounded-2xl p-4', styles.dialogWidth),
      }}
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

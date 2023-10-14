import MaterialDialog, {
  DialogProps as MaterialDialogProps,
} from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';

const PREFIX = 'Dialog';

const classes = {
  backDrop: `${PREFIX}-backDrop`,
};

const StyledMaterialDialog = styled(MaterialDialog)(() => ({
  [`& .${classes.backDrop}`]: {
    backdropFilter: 'blur(15px)',
    background:
      'radial-gradient(circle, rgba(0,46,255,0.2) 0%, rgba(252,70,107,0) 100%)',
  },
}));

interface Props extends Omit<MaterialDialogProps, 'onClose'> {
  width?: number;
  background?: string;
  showCloseIcon?: boolean;
  handleClose: (e: Event, reason: string) => void;
}

/**
 * @deprecated
 */
const Dialog = ({
  classes,
  children,
  background = 'bg-cod-gray',
  handleClose,
  showCloseIcon = false,
  width,
  ...props
}: Props) => {
  const onClick = (e: any) => handleClose(e, 'closeIconClick');

  return (
    // @ts-ignore TODO: FIX
    <StyledMaterialDialog
      {...props}
      classes={{
        ...classes,
        paper: background + ' rounded-2xl p-4',
      }}
      PaperProps={{ style: { width: width || 400 } }}
      onClose={handleClose}
    >
      {showCloseIcon ? (
        <IconButton
          aria-label="close"
          className="absolute text-white right-0 top-1"
          onClick={onClick}
          size="large"
        >
          <CloseIcon className="fill-current text-stieglitz" />
        </IconButton>
      ) : null}
      {children}
    </StyledMaterialDialog>
  );
};

export default Dialog;

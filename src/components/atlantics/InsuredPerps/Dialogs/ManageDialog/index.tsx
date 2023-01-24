import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import ManageStrategyPosition from 'components/atlantics/InsuredPerps/Dialogs/ManageDialog/ManageStrategyPosition';

interface IManageModalProps {
  section: string;
  open: boolean;
  handleClose: () => void;
}

const SECTIONS: Record<string, Record<string, string | JSX.Element>> = {
  MANAGE_STRATEGY: {
    title: 'Manage Strategy',
    component: <ManageStrategyPosition />,
  },
};

const ManageModal = (props: IManageModalProps) => {
  const { open, handleClose, section } = props;

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      keepMounted={false}
      showCloseIcon
      background={'bg-umbra'}
      width={340}
    >
      <Box className="space-y-4">
        <Typography variant="h5">{SECTIONS[section]?.['title']}</Typography>
        <Box className="position-absolute p-0 bg-cod-gray  text-white rounded-xl flex flex-col items-center">
          {SECTIONS[section]?.['component'] && SECTIONS[section]?.['component']}
        </Box>
      </Box>
    </Dialog>
  );
};

export default ManageModal;

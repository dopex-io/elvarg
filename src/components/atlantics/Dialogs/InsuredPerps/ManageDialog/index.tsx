import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';
import UseStrategy from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy';
import ManagePosition from 'components/atlantics/Dialogs/InsuredPerps/ManageDialog/ManagePosition';
import ManageStrategyPosition from 'components/atlantics/Dialogs/InsuredPerps/ManageDialog/ManageStrategyPosition';
import Typography from 'components/UI/Typography';

interface IManageModalProps {
  section: string;
  open: boolean;
  handleClose: () => void;
}

const SECTIONS: { [key: string]: { [key: string]: string | JSX.Element } } = {
  MANAGE_STRATEGY: {
    title: 'Manage Strategy',
    component: <ManageStrategyPosition />,
  },
  MANAGE_POSITION: { title: 'Manage Position', component: <ManagePosition /> },
  USE_STRATEGY: { title: 'Open Position', component: <UseStrategy /> },
};

const ManageModal = (props: IManageModalProps) => {
  const { open, handleClose, section } = props;

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      keepMounted={false}
      showCloseIcon
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

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { OpenPositionDialog } from 'components/atlantics/Dialogs/OpenPositionDialog';
import ManagePosition from './ManagePosition';
import ManageStrategyPosition from './ManageStrategyPosition';

interface IManageModalProps {
  onOpenSection: string;
  open: boolean;
  setOpen: Function;
}

const SECTIONS: { [key: string]: JSX.Element } = {
  MANAGE_STRATEGY: <ManageStrategyPosition />,
  MANAGE_POSITION: <ManagePosition />,
  USE_STRATEGY: <OpenPositionDialog />,
};

const ManageModal = (props: IManageModalProps) => {
  const { open, setOpen, onOpenSection } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <Box className="position-absolute w-[30rem] p-4 bg-cod-gray  text-white rounded-xl flex flex-col items-center">
          {SECTIONS[onOpenSection] && SECTIONS[onOpenSection]}
        </Box>
      </Modal>
    </>
  );
};

export default ManageModal;

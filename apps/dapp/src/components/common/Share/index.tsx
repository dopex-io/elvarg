import useShare from 'hooks/useShare';

import ShareDialog from './ShareDialog';

const Share = () => {
  const open = useShare((state) => state.isOpen);
  const handleClose = useShare((state) => state.close);
  const shareImageProps = useShare((state) => state.shareImageProps);

  return (
    <ShareDialog
      open={open}
      handleClose={handleClose}
      shareImageProps={shareImageProps}
    />
  );
};

export default Share;

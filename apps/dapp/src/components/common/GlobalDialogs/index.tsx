import ChangeNetworkDialog from '../ChangeNetworkDialog';
import ConnectDialog from '../ConnectDialog';
import ShareDialog from '../Share/ShareDialog';

export default function GlobalDialogs() {
  return (
    <>
      <ShareDialog />
      <ChangeNetworkDialog />
      <ConnectDialog />
    </>
  );
}

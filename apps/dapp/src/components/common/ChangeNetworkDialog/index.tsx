import { useCallback, useEffect } from 'react';
import { useSwitchNetwork } from 'wagmi';

import Dialog from 'components/UI/Dialog';

import { useBoundStore } from 'store';

import { CHAINS } from 'constants/chains';

interface Props {
  imgSrc: string;
  name: string;
  chainId: number;
}

const NetworkOption = ({ imgSrc, name, chainId }: Props) => {
  const { switchNetwork } = useSwitchNetwork();

  const handleClick = async () => {
    switchNetwork && (await switchNetwork(chainId));
  };

  return (
    <div
      className="flex space-x-3 bg-umbra rounded-md p-3 items-center hover:bg-black"
      onClick={handleClick}
      role="button"
    >
      <div>
        <img src={imgSrc} alt={name} width="20" height="22" />
      </div>
      <div className="text-white font-mono">{name}</div>
    </div>
  );
};

const ChangeNetworkDialog = () => {
  const {
    wrongNetwork,
    supportedChainIds,
    changeNetwork = 'close',
    setChangeNetwork,
  } = useBoundStore();

  useEffect(() => {
    setChangeNetwork(wrongNetwork ? 'wrong-network' : 'close');
  }, [wrongNetwork, setChangeNetwork]);

  const handleClose = useCallback(
    (_: any, reason: string) => {
      if (reason === 'backdropClick') return;
      setChangeNetwork('close');
    },
    [setChangeNetwork]
  );

  return (
    <Dialog
      width={450}
      open={changeNetwork !== 'close'}
      handleClose={handleClose}
      showCloseIcon={changeNetwork === 'user'}
      aria-labelledby="wrong-network-dialog-title"
    >
      <div className="text-white text-2xl mb-4">Change Network</div>
      <div className="text-white mb-4">
        Connect to a supported network below:
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {supportedChainIds?.map((chainId) => {
          const data = CHAINS[chainId];
          return (
            <NetworkOption
              key={chainId}
              imgSrc={data?.icon || ''}
              name={data?.name || ''}
              chainId={chainId}
            />
          );
        })}
      </div>
    </Dialog>
  );
};

export default ChangeNetworkDialog;

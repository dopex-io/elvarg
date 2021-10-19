import cx from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import MetaMask from 'assets/icons/MetaMask';

interface WatchAssetOptions {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}

function AddTokenButton({
  className,
  options,
}: {
  className?: string;
  options: WatchAssetOptions;
}) {
  const addToken = () => {
    if (window && window.ethereum) {
      window.ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options,
          },
        })
        .then((success) => {
          if (success) {
            console.log(`${options.symbol} successfully added to wallet!`);
          } else {
            throw new Error(
              `Something went wrong when adding ${options.symbol} to wallet.`
            );
          }
        })
        .catch(console.error);
    }
  };

  return (
    <IconButton
      className={cx(
        'text-white border-cod-gray hover:border-wave-blue border rounded-lg border-solid p-0.5',
        className
      )}
      onClick={addToken}
    >
      <MetaMask className="w-6 h-6" />
    </IconButton>
  );
}

export default AddTokenButton;

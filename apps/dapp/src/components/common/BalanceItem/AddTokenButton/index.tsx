import IconButton from '@mui/material/IconButton';
import cx from 'classnames';

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
    if (window && (window as any).ethereum) {
      (window as any).ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options,
          },
        })
        .then((success: boolean) => {
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
        'text-white border-transparent hover:border-wave-blue border rounded-full border-solid p-0',
        className
      )}
      onClick={addToken}
      size="large"
    >
      <img src={options.image} className="w-6" alt={options.symbol} />
    </IconButton>
  );
}

export default AddTokenButton;

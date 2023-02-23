import LaunchIcon from '@mui/icons-material/Launch';

import Typography from 'components/UI/Typography';

interface Props {
  id: string;
  marketId: string;
  label: string;
}

const KEY_TO_URL: { [key: string]: { [key: string]: string } } = {
  opensea: {
    DPX_BRIDGOOR_NFT: 'https://opensea.io/collection/dopex-bridgoor-nft',
    DPX_HALLOWEEN_NFT: 'https://opensea.io/collection/dopex-halloween-nft',
    DP: 'https://opensea.io/collection/diamond-pepes-arbi',
  },
  tofunft: {
    DPX_BRIDGOOR_NFT: 'https://tofunft.com/collection/dopex-bridgoor/items',
    DPX_HALLOWEEN_NFT: 'https://tofunft.com/collection/dopex-halloween/items',
    DP: 'https://tofunft.com/collection/diamond-pepes/items',
  },
};

const MarketplaceLink = (props: Props) => {
  const { id, label, marketId } = props;

  return (
    <Typography
      variant="h6"
      color="wave-blue"
      className="hover:underline cursor-pointer hover:underline-offset-1 text-wave-blue"
    >
      <a
        href={KEY_TO_URL[marketId]?.[id]}
        rel="noopener noreferrer"
        target="_blank"
      >
        <LaunchIcon className="fill-current text-wave-blue p-1" />
        {label}
      </a>
    </Typography>
  );
};

export default MarketplaceLink;

import { useContext } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import Typography from 'components/UI/Typography';

import { AssetsContext } from 'contexts/Assets';
import { OptionsContext } from 'contexts/Options';

import { BASE_ASSET_MAP } from 'constants/index';

import styles from './styles.module.scss';
interface AssetItemProps {
  symbol: string;
  name: string;
  id: string;
  onClick: any;
  active: boolean;
}

const AssetItem = (props: AssetItemProps) => {
  const { symbol, name, active, id, onClick } = props;

  return (
    <Box
      id={id}
      onClick={onClick}
      className={cx(
        'flex space-x-4 px-4 py-2 rounded-xl',
        active ? 'bg-cod-gray' : 'cursor-pointer',
        styles.assetItemWidth
      )}
    >
      <img
        src={`/static/svg/tokens/${symbol.toLowerCase()}.svg`}
        alt={symbol}
        className={styles.iconSize}
      />
      <Box>
        <Typography variant="h5" component="div" className="uppercase">
          {symbol}
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz capitalize"
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

const AssetHeader = () => {
  const { selectedBaseAsset, baseAssets, handleChangeSelectedBaseAsset } =
    useContext(AssetsContext);
  const { setSelectedOptionData, setLoading } = useContext(OptionsContext);

  return (
    <Box className="flex space-x-2 overflow-x-auto">
      {baseAssets
        ? baseAssets.map((token) => {
            const onClick = () => {
              setLoading(true);
              handleChangeSelectedBaseAsset(token);
              setSelectedOptionData({});
            };

            return (
              <AssetItem
                key={token}
                id={token}
                onClick={onClick}
                symbol={BASE_ASSET_MAP[token].symbol}
                name={BASE_ASSET_MAP[token].fullName}
                active={selectedBaseAsset === token}
              />
            );
          })
        : Object.keys(BASE_ASSET_MAP).map((token) => (
            <Skeleton
              key={token}
              width={156}
              height={55}
              variant="rectangular"
              animation="wave"
              classes={{ root: 'bg-cod-gray' }}
            />
          ))}
    </Box>
  );
};

export default AssetHeader;

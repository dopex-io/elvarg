import { BASE_ASSET_MAP, QUOTE_ASSET_MAP } from 'constants/index';

import { AssetData } from 'types';

export default function getAssetMapWithAddress(contractAddresses: {
  [key: string]: string;
}) {
  const temp = { ...BASE_ASSET_MAP, ...QUOTE_ASSET_MAP };
  const result: AssetData = {};
  for (const key in contractAddresses) {
    if (temp[key]) {
      result[key] = {
        ...temp[key],
        address: contractAddresses[key],
      };
    }
  }
  return result;
}

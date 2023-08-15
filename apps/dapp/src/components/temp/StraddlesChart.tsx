import React, { useCallback, useEffect, useState } from 'react';

import { getAssetPairPriceData } from './utils/straddles/getAssetPairPriceData';

type BaseAsset = 'ETH' | 'DPX' | 'RDPX';
type QuoteAsset = 'USDC' | 'USDT';
export type AssetPair = `${BaseAsset}-${QuoteAsset}`;

type StraddleChartTypes = {
  assetPair: AssetPair;
  intervals: '1m' | '5m' | '30m' | '1h' | '1d';
};

type StraddlesChartPropType = {
  assetPair?: StraddleChartTypes['assetPair'];
  interval?: StraddleChartTypes['intervals'];
};

const StraddlesChart = (
  props: StraddlesChartPropType = { assetPair: 'ETH-USDC', interval: '1d' },
) => {
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartPriceData, setChartPriceData] = useState<any>();

  const updateAssetPairPriceData = useCallback(async () => {
    if (!props.assetPair) return;
    const priceData = await getAssetPairPriceData(props.assetPair);
    setChartPriceData(priceData);
  }, [props.assetPair]);

  const loadAssetPairPriceData = useCallback(async () => {
    if (!props.assetPair) return;
    if (!chartLoading) setChartLoading(true);
    setTimeout(() => setChartLoading(false));

    await updateAssetPairPriceData();
  }, [chartLoading, props.assetPair, updateAssetPairPriceData]);
  const loadChartWithData = useCallback(() => {}, []);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    loadAssetPairPriceData()
      .then(loadChartWithData)
      .then(() => {
        interval = setInterval(updateAssetPairPriceData, 5000);
      });

    if (interval) {
      clearInterval(interval);
    }
  }, [updateAssetPairPriceData, loadAssetPairPriceData, loadChartWithData]);

  return <div>StraddlesChart</div>;
};

// const Test = () => {
//   return <StraddlesChart />;
// };

export default StraddlesChart;

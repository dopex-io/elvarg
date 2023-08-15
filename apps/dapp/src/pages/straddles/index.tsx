import React, { useMemo } from 'react';

import PageLayout from 'components/common/PageLayout';
import LeftSection from 'components/straddles/LeftSection/LeftSection';
import RightSection from 'components/straddles/RightSection/RightSection';
import RootContainer from 'components/straddles/RootContainer';
import { getStraddleOptionsPrice } from 'components/temp/utils/straddles/getStraddleOptionsPrice';

const EXAMPLE_EXPIRY = new Date().getTime() + 86400000 * 3;

// Should come from store
export const collateralTokenDecimals = 6;
export const collateralTokenPrecision = 1e6;
export const underlyingTokenDecimals = 18;
export const underlyingTokenPrecision = 1e6;
export const collateralTokenSymbol = 'USDC';
export const underlyingTokenSymbol = 'ETH';
export const sampleCurrentPrice = 1850.23;

const Straddles = () => {
  const test = useMemo(() => {
    console.log(getStraddleOptionsPrice(1000, 1000, 0.5, EXAMPLE_EXPIRY));
  }, []);
  return (
    <PageLayout>
      <div className="w-full h-full flex flex-col items-center justify-center mt-10 space-y-6">
        <RootContainer>
          <LeftSection />
          <RightSection />
        </RootContainer>
      </div>
    </PageLayout>
  );
};

export default Straddles;

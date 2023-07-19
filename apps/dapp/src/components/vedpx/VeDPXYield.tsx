import { useCallback } from 'react';

import { VeDPXYieldDistributor__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';
import { vedpxYieldDistributorAddress } from 'store/VeDPX';

import useSendTx from 'hooks/useSendTx';

import SignerButton from 'components/common/SignerButton';
import InfoTooltip from 'components/UI/InfoTooltip';
import NumberDisplay from 'components/UI/NumberDisplay';

import formatAmount from 'utils/general/formatAmount';

const VeDPXYield = () => {
  const {
    accountAddress,
    signer,
    userVedpxData: userData,
    vedpxData: data,
    updateVedpxData: updateData,
    updateUserVedpxData: updateUserData,
  } = useBoundStore();

  const sendTx = useSendTx();

  const handleCheckpoint: any = async () => {
    if (!signer || !accountAddress) return;
    const vedpxYieldDistributor = VeDPXYieldDistributor__factory.connect(
      vedpxYieldDistributorAddress,
      signer,
    );

    await sendTx(vedpxYieldDistributor, 'checkpoint', []);

    await updateData();
    await updateUserData();
  };

  const handleClaim = useCallback(async () => {
    if (!signer || !accountAddress) return;
    try {
      const vedpxYieldDistributor = VeDPXYieldDistributor__factory.connect(
        vedpxYieldDistributorAddress,
        signer,
      );

      await sendTx(vedpxYieldDistributor, 'getYield', []);
      await updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [accountAddress, sendTx, signer, updateUserData]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl text-white mb-1">veDPX Yield</h2>
        <p className="text-stieglitz text-sm">
          veDPX earns a yield from incentivized DPX rewards and protocol fees
          altogether
        </p>
      </div>
      <div className="bg-cod-gray rounded-2xl p-3 w-96">
        <div className="flex space-x-2 w-full items-center mb-3">
          <img
            className="w-10 h-10 border border-mineshaft rounded-full"
            src="/images/tokens/dpx.svg"
            alt="DPX"
          />
          <div className="flex-grow font-">
            <div>veDPX</div>
            <div className="text-stieglitz text-sm">Earn DPX</div>
          </div>
          {!userData.vedpxBalance.isZero() && !userData.userIsInitialized ? (
            <SignerButton
              className="justify-self-end"
              onClick={handleCheckpoint}
            >
              Checkpoint
            </SignerButton>
          ) : null}
        </div>
        <div className="flex justify-between items-center p-3 bg-umbra rounded-xl w-full mb-3">
          <div>
            <div className="mb-1.5 font-medium text-stieglitz text-sm">
              DPX Earned
            </div>
            <div className="font-medium text-white">
              <NumberDisplay n={userData.dpxEarned} decimals={18} /> DPX
            </div>
          </div>
          <div>
            <SignerButton
              className="justify-self-end"
              onClick={handleClaim}
              disabled={userData.dpxEarned.isZero()}
            >
              Claim
            </SignerButton>
          </div>
        </div>
        <div className="flex space-x-4 rounded-xl">
          <div className="p-3 bg-umbra rounded-xl w-full">
            <div
              color="stieglitz"
              className="mb-1.5 font-medium text-stieglitz"
            >
              Yield Rate
            </div>
            <div className="font-medium">
              {formatAmount(data.dailyDpxEmission, 1, false, true)} DPX/day
            </div>
          </div>
          <div className="p-3 bg-umbra rounded-xl w-full">
            <div className="mb-1.5 font-medium text-stieglitz text-sm">
              APY{' '}
              <InfoTooltip
                title="This considers 1 veDPX = 1 DPX (1 DPX locked for 4 years)"
                iconClassName="w-4 h-4"
              />
            </div>
            <div className="font-medium">
              {formatAmount(data.apy, 2, false, true)} %{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeDPXYield;

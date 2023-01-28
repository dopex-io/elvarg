import { useCallback } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import {
  StakingRewardsV3__factory,
  StakingRewards__factory,
} from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import NumberDisplay from 'components/UI/NumberDisplay';
import Stat from './Stat';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';
import { Farm } from 'types/farms';

interface Props {
  userRewardsEarned: BigNumber[];
  farm: Farm;
}

const ClaimCard = (props: Props) => {
  const { userRewardsEarned, farm } = props;

  const { stakingRewardsAddress, stakingTokenSymbol, version, rewardTokens } =
    farm;

  const sendTx = useSendTx();

  const { signer, getUserData } = useBoundStore();

  const handleClaim = useCallback(async () => {
    if (!signer) return;
    try {
      if (version === 3) {
        const stakingRewardsContract = StakingRewardsV3__factory.connect(
          stakingRewardsAddress,
          signer
        );

        await sendTx(stakingRewardsContract, 'claim', []);
      } else {
        const stakingRewardsContract = StakingRewards__factory.connect(
          stakingRewardsAddress,
          signer
        );

        await sendTx(stakingRewardsContract, 'getReward', [2]);
      }
      getUserData(farm);
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, stakingRewardsAddress, version, getUserData, farm]);

  return (
    <Box className="bg-cod-gray rounded-2xl p-3 flex flex-col space-y-3 w-80">
      <Box className="flex justify-between items-center">
        <Box className="flex space-x-3 items-center">
          <img
            src={`/images/tokens/${stakingTokenSymbol.toLowerCase()}.svg`}
            alt={stakingTokenSymbol}
            className="w-8 h-8 block"
          />
          <Typography variant="h5">{stakingTokenSymbol} Farm</Typography>
        </Box>
        <CustomButton
          size="small"
          className="!bg-wave-blue !text-black"
          onClick={handleClaim}
        >
          Claim
        </CustomButton>
      </Box>
      <Box className="flex space-x-3">
        {rewardTokens.map((token, index) => {
          return (
            <Stat
              name={token.symbol}
              key={token.symbol}
              value={
                <NumberDisplay
                  n={userRewardsEarned[index] || BigNumber.from(0)}
                  decimals={18}
                  decimalsToShow={4}
                />
              }
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ClaimCard;

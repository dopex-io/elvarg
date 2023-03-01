import { useState, useCallback, useEffect } from 'react';
import { formatDistance, format } from 'date-fns';
import Box from '@mui/material/Box';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/Button';
// import DisabledPanel from 'components/rdpx-v2/BondPanel/DisabledPanel';
import Input from 'components/UI/Input';

import { RdpxBond } from 'store/RdpxV2/dpxusd-bonding';
import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const Mint = () => {
  const sendTx = useSendTx();
  const [redeemDisabled, _] = useState<boolean>(true);
  const [value, setValue] = useState<number>(0);
  const [bondData, setBondData] = useState<RdpxBond>({
    tokenId: 0,
    amount: 0,
    maturity: 0,
    timestamp: 0,
  });
  const [redeemable, setRedeemable] = useState<boolean>(false);

  const {
    accountAddress,
    signer,
    chainId,
    userDscBondsData,
    treasuryContractState,
  } = useBoundStore();

  const handleUpdateBondData = useCallback(() => {
    if (!userDscBondsData.bonds) return;

    if (Number(value) < 0) {
      setBondData({
        tokenId: 0,
        amount: 0,
        maturity: 0,
        timestamp: 0,
      });
    }

    const selectedBond = userDscBondsData.bonds.find(
      (bond) => bond.tokenId === Number(value)
    );

    if (selectedBond === undefined) return;

    setBondData(selectedBond);
  }, [userDscBondsData.bonds, value]);

  const handleChange = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  const handleRedeem = useCallback(async () => {
    if (
      !redeemable ||
      !signer ||
      !treasuryContractState.contracts ||
      !accountAddress
    )
      return;

    const treasury = treasuryContractState.contracts.treasury;

    try {
      await sendTx(treasury, 'redeem', [bondData.tokenId, accountAddress]);
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    bondData.tokenId,
    redeemable,
    sendTx,
    signer,
    treasuryContractState.contracts,
  ]);

  useEffect(() => {
    if (treasuryContractState.bond_muturity.eq('0')) return;
    setRedeemable(
      Number(bondData.maturity) - Number(bondData.timestamp) >
        Number(treasuryContractState.bond_muturity)
    );
  }, [
    bondData.maturity,
    bondData.timestamp,
    treasuryContractState.bond_muturity,
  ]);

  useEffect(() => {
    handleUpdateBondData();
  }, [handleUpdateBondData, value]);

  return (
    <Box className="space-y-3 relative">
      {/* {redeemDisabled ? <DisabledPanel isMint={false} /> : null} */}
      <Box className="bg-umbra rounded-xl w-full h-fit">
        {/* h-[19.8rem] */}
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="Bond ID"
          leftElement={
            <Box className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[30px] h-[30px]"
              />
            </Box>
          }
        />
        <Box className="flex justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Balance
          </Typography>
          <Box className="flex space-x-1">
            <Typography variant="h6">
              {userDscBondsData.bonds.length}
            </Typography>
            <Typography variant="h6" color="stieglitz">
              Bonds
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex flex-col space-y-2 px-2">
        <Box className="flex justify-between">
          <Typography variant="h6" color="stieglitz">
            DSC Amount
          </Typography>
          <Typography variant="h6" color="stieglitz">
            {bondData.amount
              ? formatAmount(getUserReadableAmount(bondData.amount, 18), 3)
              : '-'}
          </Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" color="stieglitz">
            Maturation Period
          </Typography>
          <Typography variant="h6" color="stieglitz">
            {bondData.maturity
              ? formatDistance(
                  Number(bondData.maturity) * 1000,
                  Number(bondData.timestamp) * 1000
                )
              : '-'}
          </Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" color="stieglitz">
            Bond Time
          </Typography>
          <Typography variant="h6" color="stieglitz">
            {bondData.timestamp
              ? format(Number(bondData.timestamp) * 1000, 'd LLLL, yyyy H:mm')
              : '-'}
          </Typography>
        </Box>
      </Box>
      <Box className="rounded-xl p-4 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <Box className="flex justify-between">
            <Typography variant="h6" color="stieglitz">
              Receive
            </Typography>
            <Box className="flex my-auto space-x-2">
              <Typography variant="h6" color="stieglitz">
                {'-'}
              </Typography>
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[1rem] my-auto"
              />
            </Box>
          </Box>
        </Box>
        {redeemDisabled ? (
          <CustomButton
            size="medium"
            className="w-full mt-4 rounded-md"
            color={'mineshaft'}
            disabled={!redeemable}
            onClick={handleRedeem}
          >
            Redeem
          </CustomButton>
        ) : (
          <a
            className="flex space-x-2 w-full mt-4 rounded-md bg-[#3966A0] justify-between p-2"
            role="link"
            href="https://arbitrum.curve.fi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex space-x-2">
              <img
                src={'/images/tokens/crv.svg'}
                alt="crv"
                className="w-4 my-auto"
              />
              <Typography variant="h6">Sell DSC</Typography>
            </span>
            <LaunchOutlinedIcon className="fill-current text-white w-[1.1rem]" />
          </a>
        )}
      </Box>
    </Box>
  );
};

export default Mint;

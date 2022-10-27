import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import useSendTx from 'hooks/useSendTx';
import Box from '@mui/material/Box';
import { useBoundStore } from 'store';
import { Typography, CustomButton } from 'components/UI';
import { BigNumber } from 'ethers';
import { getUserReadableAmount } from 'utils/contracts';
import {
  CHAIN_ID_TO_EXPLORER,
  DECIMALS_TOKEN,
  DECIMALS_USD,
} from 'constants/index';
import ContractBox from 'components/common/ContractBox';
import { formatAmount } from 'utils/general';
import { OLP_TOKENS } from 'store/Vault/faucet';

const CHAIN_ID: number = 5;

function getUrl(address: string): string {
  return `${CHAIN_ID_TO_EXPLORER[CHAIN_ID]}/address/${address}`;
}

const Faucet = () => {
  const sendTx = useSendTx();

  const { getFaucetContract, updateBalances, balances, signer, connect } =
    useBoundStore();

  console.log(signer);

  useEffect(() => {
    connect();
    updateBalances();
  }, [connect, updateBalances]);

  const faucet = getFaucetContract();

  const handleClaim = useCallback(
    async (token: string) => {
      if (!signer || !faucet) return;
      try {
        if (token === OLP_TOKENS['USD']) {
          await sendTx(faucet.connect(signer).claimUsd(token));
        } else {
          await sendTx(faucet.connect(signer).claimToken(token));
        }
        await updateBalances();
      } catch (err) {
        console.log(err);
      }
    },
    [signer, faucet, sendTx, updateBalances]
  );

  function getBalance(balance: BigNumber, name: string) {
    return name === 'USD'
      ? `${formatAmount(getUserReadableAmount(balance, DECIMALS_USD), 2)}`
      : getUserReadableAmount(balance, DECIMALS_TOKEN);
  }

  function getBox(name: string, token: string) {
    return (
      <Box className="flex flex-col">
        <Typography variant="h6" className="grid justify-center">
          <a href={getUrl(token)} rel="noopener noreferrer" target={'_blank'}>
            {name}
          </a>
        </Typography>
        <CustomButton
          size="medium"
          className="w-full !rounded-md mt-2"
          color={'primary'}
          onClick={() => handleClaim(token)}
        >
          claim
        </CustomButton>
      </Box>
    );
  }

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Faucet | Dopex</title>
      </Head>
      <Box className="mt-12 flex flex-col w-128 items-center">
        <Typography variant="h6" className="">
          Faucet for OLPs
        </Typography>
        <ContractBox chainId={CHAIN_ID} contractAddress={faucet.address} />
        <Box className="grid gap-5 grid-cols-3">
          {Object.entries(OLP_TOKENS).map(([name, token], idx) => {
            return (
              <Box className="p-1" key={name}>
                {getBox(name, token)}
                <Typography variant="h6" className="mt-1 grid justify-center">
                  {getBalance(balances![idx]!, name)}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <footer>
          <Typography variant="h6" className="text-sm pl-1 pt-2">
            <span className="text-stieglitz">
              Click token name for its address
            </span>
          </Typography>
        </footer>
      </Box>
    </Box>
  );
};

const ManagePage = () => {
  return <Faucet />;
};

export default ManagePage;

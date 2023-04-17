import { NextApiRequest, NextApiResponse } from 'next';

import { Wallet, ethers } from 'ethers';

import { providers } from '@0xsequence/multicall';
import { Zdte__factory } from 'mocks/factories/Zdte__factory';
import { arbitrum } from 'wagmi/chains';

import { ZDTE } from 'store/Vault/zdte';

import { CHAINS } from 'constants/chains';

function validPk(value: string) {
  try {
    new Wallet(value);
  } catch (e) {
    return false;
  }
  return true;
}

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  const keeper_pk = process.env['KEEPER_PK'];
  const isKeeperValid = keeper_pk && validPk(keeper_pk);

  try {
    const provider = new providers.MulticallProvider(
      new ethers.providers.StaticJsonRpcProvider(CHAINS[arbitrum.id]?.rpc)
    );

    console.log('provider: ', provider);
    console.info('info provider: ', provider);

    // const wallet = new ethers.Wallet(keeper_pk!);
    // const signer = wallet.connect(provider);

    console.log('before zdte');
    console.info('info before zdte');

    const zdteContract = await Zdte__factory.connect(ZDTE, provider);

    console.log('before price');
    console.info('info before price');

    const price = await zdteContract.getMarkPrice();

    console.log('price');
    console.info('info price');

    // async function callContractWithRetry() {
    //   const maxRetries = 3; // maximum number of retries
    //   let retryCount = 0;

    //   while (retryCount < maxRetries) {
    //     try {

    //       // const tx = await zdteContract.connect(signer).keeperRun();
    //       // const receipt = await tx.wait();
    //       // const res = receipt.events ? receipt.events[0] : 'failed';
    //       // console.info('res: ', res);
    //       return;
    //     } catch (error) {
    //       console.error(
    //         `Failed to run keeper. Retrying... (${
    //           retryCount + 1
    //         }/${maxRetries})`
    //       );
    //       retryCount++;
    //     }
    //   }

    //   // Throw an error if the call failed after all retries
    //   throw new Error('Max retries reached. Call failed.');
    // }

    // callContractWithRetry().catch((e) => {
    //   return response.status(500).json({ error: e.message });
    // });

    return response.status(200).json({
      success: true,
      isKeeperValid: isKeeperValid,
      price: price.toNumber(),
    });
  } catch (error) {
    return response.status(500).json({ error: error });
  }
}

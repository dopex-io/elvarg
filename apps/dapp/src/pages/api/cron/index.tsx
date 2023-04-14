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

  if (!keeper_pk || !validPk(keeper_pk)) {
    return response.status(500).json({ error: 'Invalid pk for keeper' });
  }

  try {
    const provider = new providers.MulticallProvider(
      new ethers.providers.StaticJsonRpcProvider(CHAINS[arbitrum.id]?.rpc)
    );

    const wallet = new ethers.Wallet(keeper_pk!);
    const signer = wallet.connect(provider);

    const zdteContract = await Zdte__factory.connect(ZDTE, provider);

    await zdteContract
      .connect(signer)
      .keeperExpirePrevEpochSpreads()
      .then((tx) => tx.wait())
      .then((tx) => {
        const res = tx.events ? tx.events[0] : 'failed';
        console.log('tx status: ', res);
      })
      .catch((e) => {
        console.log(e);
      });

    return response.status(200).json({ success: 'true' });
  } catch (error) {
    return response.status(500).json({ error: error });
  }
}

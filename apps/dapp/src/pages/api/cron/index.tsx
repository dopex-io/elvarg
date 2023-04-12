import { NextApiRequest, NextApiResponse } from 'next';

import { ethers, utils } from 'ethers';

import { providers } from '@0xsequence/multicall';
import { Zdte__factory } from 'mocks/factories/Zdte__factory';
import { arbitrum } from 'wagmi/chains';

import { CHAINS } from 'constants/chains';

export default async function handler(
  _: NextApiRequest,
  response: NextApiResponse
) {
  const keeper_pk = process.env['KEEPER_PK'];

  if (!keeper_pk || !utils.isHexString(keeper_pk, 32)) {
    response.status(500).json({ error: 'Invalid pk for keeper' });
  }

  try {
    const provider = new providers.MulticallProvider(
      new ethers.providers.StaticJsonRpcProvider(CHAINS[arbitrum.id]?.rpc)
    );

    const wallet = new ethers.Wallet(keeper_pk!);
    const signer = wallet.connect(provider);

    const zdteContract = await Zdte__factory.connect(
      '0x5ee3a604082368b3a833ff9f0324201cfb73ae11',
      provider
    );

    await zdteContract
      .connect(signer)
      .keeperExpirePrevEpochSpreads()
      .catch((err) => {
        console.log('err: ', err);
        response.status(500).json({ error: 'Keeper fails to expire' });
      });
    response.status(200).json({ success: 'true' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
}

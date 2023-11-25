'use client';

import Image from 'next/image';

import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import { displayAddress } from 'utils/general';

const Profile = () => {
  const account = useAccount();

  const { data: ensName } = useEnsName({
    address: account.address,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    <div>
      <Image
        src={ensAvatar ? 'ensAvatar' : '/images/misc/camera-pepe-hd.png'}
        alt="avatar"
        className="rounded-md w-32 h-32 mb-3 border border-stieglitz"
        width={128}
        height={128}
      />
      <p className="font-mono font-bold bg-cod-gray p-2 rounded-md">
        {ensName ? ensName : displayAddress(account.address)}
      </p>
    </div>
  );
};

export default Profile;

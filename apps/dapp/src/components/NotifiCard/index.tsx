import React from 'react';
import { arrayify } from 'ethers/lib/utils.js';

import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';

import { useBoundStore } from 'store';

export const NotifiCard: React.FC = () => {
  const { signer, accountAddress } = useBoundStore();
  if (!accountAddress || !signer) {
    return <>loading</>;
  }

  const inputLabels: NotifiInputFieldsText = {
    placeholderText: {
      email: 'Email address',
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    emailSeparator: {
      content: 'OR',
    },
  };

  return (
    <NotifiContext
      dappAddress="dopex"
      env="Production"
      signMessage={async (message: Uint8Array) => {
        const result = await signer.signMessage(message);
        return arrayify(result);
      }}
      walletPublicKey={accountAddress}
      walletBlockchain="ARBITRUM"
    >
      <NotifiSubscriptionCard
        cardId="5c36aa7bd1fa46cb909555728f111c9f"
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode={true}
        inputs={{ userWallet: accountAddress }}
        copy={{
          FetchedStateCard: {
            SubscriptionCardV1: {
              EditCard: {
                AlertListPreview: {
                  description:
                    'Get real-time alerts to the destinations of your choice',
                },
              },
            },
          },
        }}
      />
    </NotifiContext>
  );
};

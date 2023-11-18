const blockerMessages = {
  bootstrapPhase: {
    title: 'Pools have been bootstrapped',
    body: `Please visit the 'Perpetual Pool' section to LP.`,
  },
  override: {
    title: 'Panel Temporarily Disabled',
    body: `We're currently under maintenance. Please come back later.`,
  },
  expired: {
    title: 'Perpetual Vault has expired',
    body: 'Please wait for the vault to be bootstrapped.',
  },
};

export default blockerMessages;

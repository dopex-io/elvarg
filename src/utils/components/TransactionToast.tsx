const CHAIN_ID_TO_EXPLORER = {
  421611: 'https://testnet.arbiscan.io/',
  42: 'https://kovan.etherscan.io/',
  1: 'https://etherscan.io/',
  1337: '',
};

function TransactionToast({
  message,
  txHash,
}: {
  message: string;
  txHash: string;
}) {
  return (
    <span>
      <a
        href={`${
          CHAIN_ID_TO_EXPLORER[Number(process.env.REACT_APP_DEFAULT_CHAIN_ID)]
        }tx/${txHash}`}
        target={'_blank'}
        rel={'noreferrer'}
      >
        {message} <b>↗</b>
      </a>
    </span>
  );
}

export default TransactionToast;

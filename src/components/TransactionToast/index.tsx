import getExplorerUrl from 'utils/general/getExplorerUrl';

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
        href={`${getExplorerUrl(
          Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)
        )}tx/${txHash}`}
        target={'_blank'}
        rel={'noreferrer'}
      >
        {message} <b>↗</b>
      </a>
    </span>
  );
}

export default TransactionToast;

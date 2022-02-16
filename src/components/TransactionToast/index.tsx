import getExplorerUrl from 'utils/general/getExplorerUrl';

function TransactionToast({
  message,
  txHash,
  chainId,
}: {
  message: string;
  txHash: string;
  chainId: number;
}) {
  return (
    <span>
      <a
        href={`${getExplorerUrl(chainId)}tx/${txHash}`}
        target={'_blank'}
        rel={'noreferrer'}
      >
        {message} <b>↗</b>
      </a>
    </span>
  );
}

export default TransactionToast;

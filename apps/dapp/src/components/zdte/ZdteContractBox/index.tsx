import { useBoundStore } from 'store';

import Loading from 'components/zdte/Loading';

import { CHAINS } from 'constants/chains';

const ZdteContractBox = () => {
  const { chainId, staticZdteData, zdteData, isLoading } = useBoundStore();

  if (isLoading || !zdteData || !staticZdteData) {
    return <Loading />;
  }

  return (
    <>
      <span className="text-sm text-silver hidden md:block">
        Contract Address:
      </span>
      <span className="text-sm bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text">
        <a
          href={`${CHAINS[chainId]?.explorer}/address/${
            staticZdteData?.zdteAddress ?? ''
          }`}
          rel="noopener noreferrer"
          target={'_blank'}
        >
          {staticZdteData?.zdteAddress}
        </a>
      </span>
    </>
  );
};

export default ZdteContractBox;

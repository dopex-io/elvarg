import NftClaimButton from './NftClaimButton';

const NFTS = ['Bridgoor', 'Halloween', 'Santas'];

const NftClaims = ({ account }: { account: string }) => {
  return (
    <div className="flex space-x-2 mr-2">
      {NFTS.map((name) => {
        return <NftClaimButton key={name} account={account} name={name} />;
      })}
    </div>
  );
};

export default NftClaims;

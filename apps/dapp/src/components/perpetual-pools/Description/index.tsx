import PerpetualPoolsIcon from 'svgs/icons/PerpetualPoolsIcon';

const Description = () => {
  return (
    <div className="flex justify-between border border-umbra rounded-xl p-3">
      <div className="space-y-2">
        <div className="flex space-x-2">
          <PerpetualPoolsIcon />
          <p className="text-sm my-auto">Perpetual Pool</p>
        </div>
        <p className="text-sm text-stieglitz">
          Write Perpetual Puts for $dpxETH Bonding.
        </p>
      </div>
      <a
        className="self-start rounded-sm bg-primary px-2 py-1"
        href="https://blog.dopex.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-sm my-auto text-center">Learn More</p>
      </a>
    </div>
  );
};

export default Description;

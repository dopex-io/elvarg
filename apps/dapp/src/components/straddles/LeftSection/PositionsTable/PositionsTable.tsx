import {
  getUserDeposits,
  UserReadableStraddleDeposit,
} from 'components/temp/dummyTransactions';

const PositionsTable = () => {
  const PositionsLength = (props: { length: number }) => {
    return (
      <span className="text-sm bg-mineshaft px-2 rounded-2xl">
        {props.length}
      </span>
    );
  };
  const StraddlePositionsTypeSelector = () => {
    return (
      <div className="w-full flex space-x-5 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>Buy Positions</span>
          <PositionsLength length={0} />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span>Sell Positions</span>
          <PositionsLength length={0} />
        </div>
      </div>
    );
  };

  const SellPositionsTableHeaders = () => {
    return (
      <tr>
        <td>Epoch</td>
        <td>Amount</td>
        <td>Earnings</td>
      </tr>
    );
  };
  const BuyPositionsTableHeaders = () => {
    return (
      <tr>
        <td>Epoch</td>
        <td>Amount</td>
        <td>PnL</td>
      </tr>
    );
  };

  type SellPositionsTableDataProps = {
    positions: UserReadableStraddleDeposit[];
  };

  const SellPositionsTableData = (props: SellPositionsTableDataProps) => {
    return props.positions.map((position, index) => (
      <tr key={index}>
        <td>{position.epoch}</td>
        <td>{position.amount}</td>
        <td>{position.claimed}</td>
      </tr>
    ));
  };

  const PositionsTable = () => {
    return (
      <table cellPadding={'20'} className="bg-cod-gray rounded-lg text-sm">
        <tbody className="border-stieglitz divide-y-[0.1rem] divide-umbra">
          <SellPositionsTableHeaders />
          <SellPositionsTableData positions={getUserDeposits()} />
        </tbody>
      </table>
    );
  };

  const EmptyPositionsBox = () => {
    return (
      <div className="w-full h-[5rem] flex items-center justify-center bg-cod-gray rounded-md">
        <span className="text-sm text-stieglitz">No Positions to show.</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex-[0.7] flex flex-col space-y-2">
      <StraddlePositionsTypeSelector />
      <EmptyPositionsBox />
      {/* { true ? <PositionsTable />} */}
    </div>
  );
};

export default PositionsTable;

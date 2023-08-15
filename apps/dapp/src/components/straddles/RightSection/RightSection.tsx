import ManageCard from './ManageCard';

const RightSection = () => {
  return (
    <div className="w-1/4 h-full p-4">
      <div className="h-full w-full flex flex-col space-y-6">
        <ManageCard />
        {/* <StraddleCalculator /> */}
      </div>
    </div>
  );
};

export default RightSection;

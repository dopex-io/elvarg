type BreakEvensAndStrikesProps = {
  upperBreakeven: string;
  lowerBreakEven: string;
  strike: string;
  loading: boolean;
};
const BreakEvensAndStrikes = (props: BreakEvensAndStrikesProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center divide-x-[0.1rem] border divide-umbra border-umbra rounded-md">
      <div className="w-full h-full flex justify-center items-center flex-1 hover:bg-umbra">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm">{props.lowerBreakEven}</span>
          <span className="text-stieglitz text-xs">Put B/E</span>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center flex-1 hover:bg-umbra">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm">{props.lowerBreakEven}</span>
          <span className="text-stieglitz text-xs">Strike</span>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center flex-1 hover:bg-umbra">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm">{props.lowerBreakEven}</span>
          <span className="text-stieglitz text-xs">Call B/E</span>
        </div>
      </div>
    </div>
  );
};

export default BreakEvensAndStrikes;

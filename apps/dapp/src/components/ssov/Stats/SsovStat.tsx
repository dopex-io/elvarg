const SsovStat = (props: { value: any; title: string }) => {
  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <span className="text-white text-sm">{props.value}</span>
      <span className="text-stieglitz text-sm">{props.title}</span>
    </div>
  );
};

export default SsovStat;

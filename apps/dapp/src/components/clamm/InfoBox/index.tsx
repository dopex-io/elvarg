import clammInfo from 'public/locales/en/clamm.json';

const InfoBox = () => {
  return (
    <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
      <span className="flex w-full justify-between">
        <h6 className="text-xs">{clammInfo.infoBox.header}</h6>
        <a
          className="hover:cursor-pointer px-1 py-[1px] text-xs bg-primary rounded-sm"
          rel="noopener noreferrer"
          target="_blank"
          href={clammInfo.infoBox.url}
        >
          {clammInfo.infoBox.buttonLabel}
        </a>
      </span>
      <p className="text-stieglitz text-xs">{clammInfo.infoBox.description}</p>
    </div>
  );
};

export default InfoBox;

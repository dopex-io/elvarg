import ssovInfo from 'public/locales/en/ssov.json';

const InfoBox = () => {
  return (
    <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
      <span className="flex w-full justify-between">
        <h6 className="text-xs">{ssovInfo.infoBox.header}</h6>
        <a
          className="hover:cursor-pointer px-1 py-[1px] text-xs bg-primary rounded-sm"
          rel="noopener noreferrer"
          target="_blank"
          href={ssovInfo.infoBox.url}
        >
          {ssovInfo.infoBox.buttonLabel}
        </a>
      </span>
      <p className="text-stieglitz text-xs">{ssovInfo.infoBox.description}</p>
    </div>
  );
};

export default InfoBox;

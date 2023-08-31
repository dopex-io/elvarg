interface Props {
  title: string;
  url: string;
  buttonLabel: string;
  contentBody: string;
}

const InfoBox = (props: Props) => {
  const { title, url, buttonLabel, contentBody } = props;

  return (
    <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
      <span className="flex w-full justify-between">
        <h6 className="text-xs">{title}</h6>
        <a
          className="hover:cursor-pointer px-1 py-[1px] text-xs bg-primary rounded-sm"
          rel="noopener noreferrer"
          target="_blank"
          href={url}
        >
          {buttonLabel}
        </a>
      </span>
      <p className="text-stieglitz text-xs">{contentBody}</p>
    </div>
  );
};

export default InfoBox;

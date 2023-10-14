import { useState } from 'react';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

interface Props {
  text: string;
  iconSymbol: string;
  url: string;
  body?: string;
}

const QuickLink = (props: Props) => {
  const { text, iconSymbol = '', url, body = '' } = props;

  const [active, setActive] = useState<boolean>(false);

  return (
    <div
      className={`p-2 border rounded-xl transform ease-in-out duration-200 bg-umbra ${
        active ? 'border-mineshaft' : 'border-umbra'
      }`}
    >
      <a
        className="flex justify-between"
        href={url}
        rel="noopener noreferrer"
        target="_blank"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="flex space-x-4">
          <img
            src={iconSymbol}
            alt="img"
            className="w-[20px] h-[20px] mt-[1px]"
          />
          <p className="text-sm my-auto">{text}</p>
        </div>
        <LaunchOutlinedIcon className="fill-current text-white opacity-40 w-[1.2rem]" />
      </a>

      <span className="text-stieglitz text-sm">{body}</span>
    </div>
  );
};

export default QuickLink;

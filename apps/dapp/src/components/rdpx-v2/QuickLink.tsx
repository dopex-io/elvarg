import { useState } from 'react';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Typography2 from 'components/UI/Typography2';

interface Props {
  text: string;
  iconSymbol: string;
  url: string | undefined;
  body?: string;
}

const QuickLink = (props: Props) => {
  const { text, iconSymbol = '', url, body = '' } = props;

  const [active, setActive] = useState<boolean>(false);

  return (
    <a
      className={`p-3 w-full border rounded-xl transform ease-in-out duration-200 bg-umbra ${
        active ? 'border-mineshaft' : 'border-umbra'
      }`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      role="link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="flex justify-between">
        <div className="flex space-x-2">
          <img src={iconSymbol} alt="img" className="w-[20px] h-[20px]" />
          <Typography2 variant="subtitle2" className="my-auto">
            {text}
          </Typography2>
        </div>
        <LaunchOutlinedIcon className="fill-current text-white opacity-40 w-[1.2rem]" />
      </span>
      <span className="text-stieglitz text-sm">{body}</span>
    </a>
  );
};

export default QuickLink;

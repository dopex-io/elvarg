import { useState } from 'react';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

interface Props {
  text: string;
  iconSymbol: string;
  url: string;
}

const QuickLink = (props: Props) => {
  const { text, iconSymbol = '', url } = props;

  const [active, setActive] = useState<boolean>(false);

  return (
    <a
      className={`flex justify-between p-3 border rounded-xl transform ease-in-out duration-200 ${
        active ? 'border-mineshaft' : 'border-umbra'
      }`}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex space-x-4">
        <img src={iconSymbol} alt="img" className="w-[30px] h-[30px]" />
        <p className="text-sm my-auto">{text}</p>
      </div>
      <LaunchOutlinedIcon className="fill-current text-mineshaft w-[1.2rem]" />
    </a>
  );
};

export default QuickLink;

import { useState } from 'react';
import Box from '@mui/material/Box';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Typography from 'components/UI/Typography';

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
      className={`flex justify-between p-3 border rounded-xl w-1/3 transform ease-in-out duration-200 ${
        active ? 'border-mineshaft' : 'border-umbra'
      }`}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <Box className="flex space-x-4">
        <img src={iconSymbol} alt="img" className="w-[30px] h-[30px]" />
        <Typography variant="h6" className="my-auto">
          {text}
        </Typography>
      </Box>
      <LaunchOutlinedIcon className="fill-current text-mineshaft w-[1.2rem]" />
    </a>
  );
};

export default QuickLink;

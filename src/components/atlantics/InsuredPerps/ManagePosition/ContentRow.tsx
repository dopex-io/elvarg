import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface IContentRowProps {
  title: string;
  content: string | number | ReactNode;
}

const ContentRow = ({ title, content }: IContentRowProps) => {
  return (
    <Box className="flex space-y-2 flex-row w-full justify-between items-center">
      <Typography variant="h6" color="stieglitz">
        {title}
      </Typography>
      <Typography variant="h6">{content}</Typography>
    </Box>
  );
};

export default ContentRow;

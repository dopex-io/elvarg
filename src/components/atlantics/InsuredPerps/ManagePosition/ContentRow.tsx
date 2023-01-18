import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface IContentRowProps {
  title: string;
  content: string | number | ReactNode;
  highlightPnl?: boolean;
}

const ContentRow = ({ title, content, highlightPnl }: IContentRowProps) => {
  return (
    <Box className="flex space-y-2 flex-row w-full justify-between items-center">
      <Typography variant="h6" color="stieglitz">
        {title}
      </Typography>
      <Typography
        variant="h6"
        color={
          highlightPnl
            ? Number(content) > 0
              ? 'up-only'
              : 'down-bad'
            : 'white'
        }
      >
        {highlightPnl ? '$' + content : content}
      </Typography>
    </Box>
  );
};

export default ContentRow;

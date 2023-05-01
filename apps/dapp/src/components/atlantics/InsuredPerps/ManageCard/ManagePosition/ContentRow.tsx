import { ReactNode } from 'react';

import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { formatAmount } from 'utils/general';

interface IContentRowProps {
  title: string;
  content: string | number | ReactNode;
  highlightPnl?: boolean;
  comma?: boolean;
  textSize?: 'caption' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
}

const ContentRow = ({
  title,
  content,
  highlightPnl,
  comma,
  textSize,
}: IContentRowProps) => {
  const absAmount = Math.abs(Number(content));
  return (
    <Box className="flex flex-row w-full justify-between items-center">
      <Typography variant={textSize ? textSize : 'h6'} color="stieglitz">
        {title}
      </Typography>
      <Typography
        variant={textSize ? textSize : 'h6'}
        color={
          highlightPnl
            ? Number(content) > 0
              ? 'up-only'
              : 'down-bad'
            : 'white'
        }
      >
        {highlightPnl
          ? Number(content) < 0
            ? '-$' + (comma ? formatAmount(absAmount, 2) : absAmount)
            : '$' + (comma ? formatAmount(absAmount, 2) : absAmount)
          : content}
      </Typography>
    </Box>
  );
};

export default ContentRow;

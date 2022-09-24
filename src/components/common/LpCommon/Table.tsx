import { Box, TableContainer, TableCell } from '@mui/material';
import { Typography } from 'components/UI';
import styled from '@emotion/styled';

export const StyleTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0 0.5em !important;
  }
  td {
    border: solid 1px #000;
    border-style: solid none;
    padding: 10px 16px;
  }
`;

export const getHeaderCell = (title: string) => {
  return (
    <TableCell
      align="right"
      className="text-stieglitz bg-cod-gray border-0 pb-3"
    >
      <Typography variant="h6" color="text-stieglitz" className="text-center">
        {title}
      </Typography>
    </TableCell>
  );
};

export const getBodyCell = (data: string) => {
  return (
    <TableCell className="pt-1">
      <Typography variant="h6" className="text-center">
        {data}
      </Typography>
    </TableCell>
  );
};

export const getDialogRow = (data: string, value: string) => {
  return (
    <Box className="flex flex-row justify-between">
      <Box className="flex">
        <Typography variant="h6" className="text-sm pl-1 pt-2">
          <span className="text-stieglitz">{data}</span>
        </Typography>
      </Box>
      <Box className="ml-auto mr-0">
        <Typography
          variant="h6"
          color="text-stieglitz"
          className=" text-sm pl-1 pt-2 pr-3"
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

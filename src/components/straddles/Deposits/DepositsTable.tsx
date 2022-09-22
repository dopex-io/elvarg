import { useState } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import WithdrawModal from '../Dialogs/Withdraw';

interface TableHeaderProps {
  label: string;
  variant?: string;
  showArrowIcon?: boolean;
}

export const TableHeader = ({
  label,
  variant = '',
  showArrowIcon = false,
}: TableHeaderProps) => {
  return (
    <TableCell className="border-0 pb-0">
      <Typography variant="h6" color="stieglitz" className={`${variant}`}>
        {label}
        {showArrowIcon ? <ArrowDownwardIcon className="w-4 pb-2 ml-2" /> : null}
      </Typography>
    </TableCell>
  );
};

const DepositsTable = () => {
  const { straddlesUserData } = useBoundStore();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);
  const [selectedPositionNftIndex, setSelectedPositionNftIndex] = useState<
    number | null
  >(null);

  const handleWithdraw = (id: number) => {
    setIsWithdrawModalOpen(true);
    setSelectedPositionNftIndex(id);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Amount" showArrowIcon />
              <TableHeader label="Epoch" />
              <TableHeader label="Premium & Funding" variant="text-end" />
              <TableHeader label="Action" variant="text-end" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {straddlesUserData?.writePositions?.map((position, i) => (
              <TableRow key={i}>
                <TableCell className="pt-1 border-0">
                  <Box className="rounded-md w-2/3 flex justify-between p-2">
                    <Typography variant="h6" className="pt-[2px]">
                      {formatAmount(
                        getUserReadableAmount(position.usdDeposit, 6),
                        2
                      )}
                    </Typography>
                    <Box className="rounded-sm bg-mineshaft">
                      <Typography
                        variant="h6"
                        className="px-1 py-[2px]"
                        color="stieglitz"
                      >
                        USDC
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6">
                    {Number(position.epoch!)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" className="text-right">
                    $
                    {getUserReadableAmount(position.premiumFunding, 26).toFixed(
                      2
                    )}
                  </Typography>
                </TableCell>
                <TableCell className="flex justify-end border-0">
                  <CustomButton
                    onClick={() => handleWithdraw(i)}
                    className={
                      'cursor-pointer bg-primary hover:bg-primary text-white'
                    }
                  >
                    Withdraw
                  </CustomButton>
                  {isWithdrawModalOpen && (
                    <WithdrawModal
                      open={isWithdrawModalOpen}
                      selectedPositionNftIndex={selectedPositionNftIndex}
                      handleClose={closeWithdrawModal}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {straddlesUserData?.writePositions?.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DepositsTable;

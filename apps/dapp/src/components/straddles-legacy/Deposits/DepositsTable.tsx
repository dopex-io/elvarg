import { useState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

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

const Label = ({ active }: { active: boolean }) => {
  return active ? (
    <Box className="ml-2 -mt-1 p-1 rounded-lg border border-emerald-500 border-opacity-30 bg-emerald-500 bg-opacity-10">
      <Typography variant="h6" className="-mt-1" color="emerald-500">
        Active
      </Typography>
    </Box>
  ) : (
    <Box className="ml-2 -mt-1 p-1 rounded-lg border border-stieglitz border-opacity-30 bg-stieglitz bg-opacity-10">
      <Typography variant="h6" className="-mt-1" color="stieglitz">
        Inactive
      </Typography>
    </Box>
  );
};

const DepositsTable = () => {
  const { straddlesUserData, straddlesData, accountAddress, isLoading } =
    useBoundStore();

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
            {!isLoading &&
              straddlesUserData?.writePositions?.map((position, i) => (
                <TableRow key={i}>
                  <TableCell className="pt-1 border-0">
                    <Box className="rounded-md w-2/3 flex justify-between p-2">
                      <Typography variant="h6" className="pt-[2px]">
                        {formatAmount(
                          getUserReadableAmount(position.usdDeposit, 6),
                          2,
                        )}
                      </Typography>
                      <Box className="rounded-sm bg-mineshaft">
                        <Typography
                          variant="h6"
                          className="px-1 py-[2px]"
                          color="stieglitz"
                        >
                          USDC.e
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className="pt-1 border-0 flex">
                    <Typography variant="h6">
                      {position.epoch.toNumber()}
                    </Typography>
                    <Label
                      active={
                        position.epoch.toNumber() ==
                          straddlesData?.currentEpoch! &&
                        !straddlesData?.isEpochExpired
                      }
                    />
                  </TableCell>
                  <TableCell className="pt-1 border-0">
                    <Typography variant="h6" className="text-right">
                      $
                      {getUserReadableAmount(
                        position.premiumFunding,
                        26,
                      ).toFixed(2)}
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
        {straddlesUserData?.writePositions?.length === 0 ||
        accountAddress == undefined ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DepositsTable;

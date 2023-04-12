import { SetStateAction, useCallback, useState } from 'react';
import { BigNumber } from 'ethers';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useBoundStore } from 'store';
import { StraddlePosition } from 'store/Vault/straddles';

import useSendTx from 'hooks/useSendTx';
import useShare from 'hooks/useShare';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import { TableHeader } from 'components/straddles/Deposits/DepositsTable';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getPercentageDifference from 'utils/math/getPercentageDifference';

import { DECIMALS_STRIKE } from 'constants/index';

const PositionsTable = () => {
  const sendTx = useSendTx();
  const share = useShare((state) => state.open);

  const {
    signer,
    straddlesUserData,
    straddlesData,
    updateStraddlesUserData,
    accountAddress,
    isLoading,
    tokenPrices,
  } = useBoundStore();

  const handleExercise = useCallback(
    async (selectedPositionNftIndex: number) => {
      if (!straddlesData?.isEpochExpired || !straddlesData?.straddlesContract)
        return;

      if (straddlesData && straddlesUserData && signer) {
        await sendTx(
          straddlesData?.straddlesContract.connect(signer),
          'settle',
          [
            straddlesUserData?.straddlePositions![selectedPositionNftIndex!]![
              'id'
            ],
          ]
        );
        await updateStraddlesUserData!();
      }
    },
    [straddlesData, straddlesUserData, signer, updateStraddlesUserData, sendTx]
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = useCallback(
    (event: { currentTarget: SetStateAction<HTMLElement | null> }) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const handleShare = useCallback(
    async (position: StraddlePosition) => {
      const contractName = await straddlesData?.straddlesContract?.name();
      const tokenName = contractName?.split(' ')[0];
      const tokenPrice =
        tokenPrices.find((token) => token.name === tokenName)?.price || 0;

      share({
        title: (
          <Typography variant="h4" className="font-bold shadow-2xl">
            {tokenName} Straddle
          </Typography>
        ),
        percentage: getPercentageDifference(
          tokenPrice,
          getUserReadableAmount(position.apStrike, DECIMALS_STRIKE)
        ),
        customPath: '/straddles',
        stats: [
          {
            name: 'Strike Price',
            value: `$${formatAmount(
              getUserReadableAmount(position.apStrike, DECIMALS_STRIKE),
              2
            )}`,
          },
          { name: 'Mark Price', value: `$${formatAmount(tokenPrice, 2)}` },
          {
            name: 'Epoch',
            value: position.epoch.toString(),
          },
        ],
      });
    },
    [share, tokenPrices, straddlesData?.straddlesContract]
  );

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Amount" showArrowIcon />
              <TableHeader label="AP Strike" />
              <TableHeader label="PnL" />
              <TableHeader label="Epoch" />
              <TableHeader label="Action" variant="text-end" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {!isLoading &&
              straddlesUserData?.straddlePositions?.map((position, i) => (
                <TableRow key={i}>
                  <TableCell className="pt-2 border-0">
                    <Box>
                      <Box
                        className={`rounded-md flex items-center px-2 py-2 w-fit`}
                      >
                        <Typography variant="h6" className="pr-7 pt-[2px]">
                          {formatAmount(
                            getUserReadableAmount(
                              position.amount.div(BigNumber.from(2)),
                              18
                            ),
                            8
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className="pt-1 border-0">
                    <Typography variant="h6" className="text-[#6DFFB9]">
                      ${getUserReadableAmount(position.apStrike, 8).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell className="pt-1 border-0">
                    <Typography
                      variant="h6"
                      color="white"
                      className="text-left"
                    >
                      ${getUserReadableAmount(position.pnl, 18).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell className="pt-1 border-0">
                    <Typography variant="h6">
                      {Number(position.epoch!)}
                    </Typography>
                  </TableCell>
                  <TableCell className="flex justify-end border-0">
                    <Box className="flex justify-end">
                      <CustomButton
                        className="cursor-pointer text-white"
                        color={
                          !straddlesData?.isEpochExpired
                            ? 'mineshaft'
                            : 'primary'
                        }
                        disabled={
                          !straddlesData?.isEpochExpired ||
                          straddlesUserData?.straddlePositions![i]!.pnl.lte(0)
                        }
                        onClick={() => handleExercise(i)}
                      >
                        Exercise
                      </CustomButton>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClickMenu}
                        className="long-menu rounded-md bg-mineshaft mx-1 p-0 hover:bg-opacity-80 hover:bg-mineshaft flex"
                        size="large"
                      >
                        <MoreVertIcon className="fill-current text-white" />
                      </IconButton>
                      <Box>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                          classes={{ paper: 'bg-umbra' }}
                        >
                          <MenuItem
                            key="share"
                            onClick={() => handleShare(position)}
                            className="text-white"
                            disabled={position.pnl.eq(BigNumber.from(0))}
                          >
                            Share
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="flex">
        {straddlesUserData?.straddlePositions?.length === 0 ||
        accountAddress == undefined ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default PositionsTable;

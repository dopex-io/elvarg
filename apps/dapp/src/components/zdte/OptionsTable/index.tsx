import { useCallback } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBoundStore } from 'store';

import {
  StyleLeftTableCell,
  StyleRightTableCell,
  StyleTableCellHeader,
} from 'components/common/LpCommon/Table';
import Loading from 'components/zdte/Loading';
import {
  OptionsTableRow,
  OptionsTableRowLower,
} from 'components/zdte/OptionsTable/OptionsTableRow';

import { formatAmount } from 'utils/general';

const StyleHeaderTable = styled(TableContainer)`
  table {
    border-collapse: separate !important;
    border-spacing: 0;
    border-radius: 0.5rem;
  }
  tr:last-of-type td:first-of-type {
    border-radius: 0 0 0 10px;
  }
  tr:last-of-type td:last-of-type {
    border-radius: 0 0 10px 0;
  }
`;

export const OptionsTable = () => {
  const {
    zdteData,
    staticZdteData,
    selectedSpreadPair,
    getZdteContract,
    signer,
    provider,
    setSelectedSpreadPair,
    setFocusTrade,
    setTextInputRef,
  } = useBoundStore();

  const zdteContract = getZdteContract();
  const tokenPrice = zdteData?.tokenPrice;

  const handleSelectLongStrike = useCallback(
    async (value: number) => {
      if (!signer || !provider || !zdteContract || !setSelectedSpreadPair)
        return;
      try {
        if (
          selectedSpreadPair === undefined ||
          selectedSpreadPair.longStrike === undefined
        ) {
          setSelectedSpreadPair({
            ...selectedSpreadPair,
            longStrike: value,
          });
          setFocusTrade(true);
        } else if (selectedSpreadPair.shortStrike === value) {
          setSelectedSpreadPair({
            ...selectedSpreadPair,
            shortStrike: undefined,
          });
          setTextInputRef(false);
        } else if (selectedSpreadPair.longStrike === value) {
          setSelectedSpreadPair({
            ...selectedSpreadPair,
            longStrike: undefined,
          });
        } else {
          setSelectedSpreadPair({
            ...selectedSpreadPair,
            shortStrike: value,
          });
          setTextInputRef(true);
        }
      } catch (e) {
        console.log('fail to set strike', e);
      }
    },
    [
      signer,
      provider,
      zdteContract,
      selectedSpreadPair,
      setSelectedSpreadPair,
      setFocusTrade,
      setTextInputRef,
    ]
  );

  if (!zdteData || !staticZdteData) {
    return <Loading />;
  }

  if (zdteData.failedToFetch) {
    return (
      <div className="flex flex-col flex-grow w-full whitespace-nowrap">
        <span className="ml-auto mr-auto text-[0.8rem] h-full mb-10">
          Failed to fetch volatility data from oracle
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full whitespace-nowrap">
      <StyleHeaderTable>
        <Table>
          <TableHead>
            <TableRow>
              <StyleLeftTableCell
                align="left"
                className="flex space-x-1 rounded-tl-xl"
              >
                <ArrowDownwardIcon className="fill-current text-stieglitz w-4 my-auto" />
                <span className="text-sm text-stieglitz my-auto min-w-width">
                  Strike Price
                </span>
              </StyleLeftTableCell>
              <StyleTableCellHeader>Premium</StyleTableCellHeader>
              <StyleTableCellHeader>Implied Vol</StyleTableCellHeader>
              <StyleTableCellHeader>Delta</StyleTableCellHeader>
              <StyleRightTableCell align="right" className="rounded-tr-xl">
                <span className="text-sm text-stieglitz">Action</span>
              </StyleRightTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {zdteData.strikes
              .filter((s) => s.strike >= zdteData.tokenPrice)
              .map((optionsStats, index) => (
                <OptionsTableRow
                  key={index}
                  tokenPrice={tokenPrice!}
                  optionsStats={optionsStats}
                  selectedSpreadPair={selectedSpreadPair}
                  handleSelectLongStrike={handleSelectLongStrike}
                  idx={index}
                />
              ))}
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} align="center" className="border-none">
                <div className="relative flex py-5 items-center col-span-8">
                  <div className="flex-grow border-t border-stieglitz"></div>
                  <span className="flex-shrink px-3 py-1 text-up-only border border-stieglitz">
                    ${formatAmount(tokenPrice, 2)}
                  </span>
                  <div className="flex-grow border-t border-stieglitz"></div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody className="rounded-lg">
            {zdteData.strikes
              .filter((s) => s.strike < zdteData.tokenPrice)
              .map((optionsStats, index) => (
                <OptionsTableRowLower
                  key={index}
                  tokenPrice={tokenPrice!}
                  optionsStats={optionsStats}
                  selectedSpreadPair={selectedSpreadPair}
                  handleSelectLongStrike={handleSelectLongStrike}
                  idx={index}
                />
              ))}
          </TableBody>
        </Table>
      </StyleHeaderTable>
    </div>
  );
};

export default OptionsTable;

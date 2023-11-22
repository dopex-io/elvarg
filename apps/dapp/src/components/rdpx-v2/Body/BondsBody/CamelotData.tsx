import { useEffect, useMemo, useState } from 'react';

import { useAccount } from 'wagmi';

import useCamelotLP from 'hooks/rdpx/useCamelotLP';

import TableLayout from 'components/common/TableLayout';
import MigrateAndBond from 'components/rdpx-v2/Dialogs/MigrateAndBond';
import columns, {
  CamelotPosition,
} from 'components/rdpx-v2/Tables/ColumnDefs/CamelotPositionColumn';
import Typography2 from 'components/UI/Typography2';

const CamelotData = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const { address: user = '0x' } = useAccount();
  const {
    updateUserCamelotPositions,
    loading,
    camelotPositionManagerState,
    balance,
  } = useCamelotLP({ user });

  const handleClose = () => setOpen(false);

  const userCamelotPositions = useMemo(() => {
    if (balance === 0n) return [];

    return camelotPositionManagerState.map((position, index) => {
      return {
        id: position.id,
        liquidity: position.liquidity,
        composition: position.poolComposition,
        button: {
          label: 'Migrate',
          onClick: () => {
            setOpen(true);
            setIndex(index);
          },
        },
      };
    });
  }, [balance, camelotPositionManagerState]);

  useEffect(() => {
    updateUserCamelotPositions();
  }, [updateUserCamelotPositions]);

  return camelotPositionManagerState.length > 0 ? (
    <div className=" bg-cod-gray rounded-xl divide-y-2 divide-cod-gray space-y-2">
      <Typography2 variant="subtitle2" color="white" className="px-2">
        Your available Camelot LP
      </Typography2>
      <TableLayout<CamelotPosition>
        data={userCamelotPositions}
        columns={columns}
        rowSpacing={2}
        fill="bg-umbra"
        isContentLoading={loading && user !== '0x'}
      />
      <MigrateAndBond
        isOpen={open}
        user={user}
        handleClose={handleClose}
        position={camelotPositionManagerState[index]}
        steps={[
          {
            label: 'Remove Camelot LP',
            description:
              'Collect fee, remove liquidity and burn your rDPX-WETH LP tokens.',
            disabled: loading,
            buttonLabel: 'Remove LP',
            action: () => null,
          },
          {
            label: 'Bond',
            description: 'Approve and bond your rDPX + WETH.',
            // data: `${0}`,
            disabled: loading,
            buttonLabel: 'Bond',
            action: () => null,
          },
        ]}
      />
    </div>
  ) : null;
};

export default CamelotData;

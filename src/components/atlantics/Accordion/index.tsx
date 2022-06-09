import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import cx from 'classnames';
import { css } from '@emotion/css';
import { useMemo } from 'react';

import Typography from 'components/UI/Typography';
import PoolCard from 'components/atlantics/Pool';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import formatAmount from 'utils/general/formatAmount';
import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import CallsIcon from 'svgs/icons/CallsIcon';
import PutsIcon from 'svgs/icons/PutsIcon';
import { DurationTypesOfPools, IAtlanticPoolType } from 'contexts/Atlantics';

const accordionStyle = css`
  color: 'darkslategray';
  border-radius: 0.6rem !important;
`;

interface CustomAccordionProps {
  header: string;
  putPools: DurationTypesOfPools;
  callPools: DurationTypesOfPools;
  className: string;
}

interface FilteredPoolsInterface {
  duration: string;
  pool: IAtlanticPoolType;
}

const CustomAccordion = ({
  putPools,
  callPools,
  header,
  className,
}: CustomAccordionProps) => {
  const [expand, setExpand] = useState(true);

  const callPoolFiltered = useMemo(() => {
    if (!callPools) return;
    let pools: FilteredPoolsInterface[] = [];
    const keys: any = Object.keys(callPools);
    keys
      .map((key: 'daily' | 'weekly' | 'monthly') => callPools[key])
      .filter((pool: IAtlanticPoolType, index: any) => {
        if (pool) {
          pools = [
            ...pools,
            {
              duration: keys[index] ?? null,
              pool: pool,
            },
          ];
        }
        return pool !== null;
      });
    return pools;
  }, [callPools]);

  const putsPoolFiltered = useMemo(() => {
    if (!putPools) return;
    let pools: FilteredPoolsInterface[] = [];
    const keys: any = Object.keys(putPools);
    keys
      .map((key: 'daily' | 'weekly' | 'monthly') => putPools[key])
      .filter((pool: IAtlanticPoolType, index: any) => {
        if (pool) {
          pools = [
            ...pools,
            {
              duration: keys[index] ?? null,
              pool: pool,
            },
          ];
        }
        return pool !== null;
      });
    return pools;
  }, [putPools]);

  const handleExpand = () => {
    setExpand((prev) => !prev);
  };

  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      className={cx(className, accordionStyle)}
      expanded={true}
      // onClick={handleExpand}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="fill-current text-white" />}
      >
        <Box className="flex space-x-2">
          <img
            src={`/images/tokens/${header.toLowerCase()}.svg`}
            alt={header}
            className="h-8 mr-2 border border-mineshaft rounded-full"
          />

          <Typography variant="h5" className="text-white my-auto">
            {header}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails className="rounded-2xl space-y-4">
        <Box className="flex flex-col space-x-3">
          {putsPoolFiltered!.map(
            ({ duration, pool }: FilteredPoolsInterface, index) => {
              return (
                <PoolCard
                  key={index}
                  underlying={pool.tokens.underlying}
                  depositToken={pool.tokens.deposit}
                  duration={duration.toUpperCase()}
                  tvl={pool.tvl}
                  apy={pool.apy}
                  isPut={true}
                />
              );
            }
          )}
        </Box>

        <Box className="flex flex-col space-y-4">
          {callPoolFiltered!.map(
            ({ duration, pool }: FilteredPoolsInterface, index) => {
              return (
                <PoolCard
                  key={index}
                  underlying={pool.tokens.underlying}
                  depositToken={pool.tokens.underlying}
                  duration={duration.toUpperCase()}
                  tvl={pool.tvl}
                  apy={pool.apy}
                  isPut={false}
                />
              );
            }
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
/* Accordion component for AP markets
 Accordion Description 
-- Icon + Token Symbol [+ Note. Eg: 'New pools' for new pools added (insured stables, gmx perps, etc.)]
Accordion Body
-- Stats card (TVL & Volume) 
-- Count (Pools)
-- Cards (Pools)
*/

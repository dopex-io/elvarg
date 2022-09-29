import { useState, useMemo } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import Typography from 'components/UI/Typography';
import PoolCard from 'components/atlantics/Pool';

import { DurationTypesOfPools, IAtlanticPoolType } from 'contexts/Atlantics';

const CustomizedAccordion = styled(Accordion)`
  color: 'darkslategray';
  border-radius: 0.6rem !important;
`;

interface CustomAccordionProps {
  header: string;
  putPools?: DurationTypesOfPools;
  callPools?: DurationTypesOfPools;
  className: string;
}

interface FilteredPoolsInterface {
  duration: string;
  pool: IAtlanticPoolType;
}

const CustomAccordion = ({
  putPools,
  header,
  className,
}: CustomAccordionProps) => {
  const [expand, setExpand] = useState(true);

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
    setExpand((_) => expand);
  };

  return (
    <CustomizedAccordion
      TransitionProps={{ unmountOnExit: true }}
      className={className}
      expanded={true}
      onClick={handleExpand}
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

          <Typography variant="h5" className="my-auto">
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
                  underlying={pool.tokens['underlying'] ?? ''}
                  depositToken={pool.tokens['deposit'] ?? ''}
                  duration={duration.toUpperCase()}
                  tvl={pool.tvl}
                  apy={'0'}
                  isPut={true}
                />
              );
            }
          )}
        </Box>
      </AccordionDetails>
    </CustomizedAccordion>
  );
};

export default CustomAccordion;

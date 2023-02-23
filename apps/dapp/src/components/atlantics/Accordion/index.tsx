import { useState, useMemo } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import Typography from 'components/UI/Typography';
import PoolCard from 'components/atlantics/PoolCard';

import { Pool } from 'pages/atlantics';

const CustomizedAccordion = styled(Accordion)`
  color: 'darkslategray';
  border-radius: 0.6rem !important;
`;

interface CustomAccordionProps {
  header: string;
  putPools: Pool[] | undefined;
  className: string;
}

interface FilteredPoolsInterface {
  duration: string;
  pool: Pool;
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
    putPools.filter((pool: Pool) => {
      if (pool) {
        pools = [
          ...pools,
          {
            duration: pool.duration ?? null,
            pool: pool,
          },
        ];
      }
      return pool !== null;
    });
    return pools;
  }, [putPools]);

  const handleExpand = () => {
    setExpand((expand) => !expand);
  };

  return (
    <CustomizedAccordion
      TransitionProps={{ unmountOnExit: true }}
      className={className}
      expanded={expand}
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
        <Box className="flex flex-col w-full space-y-2">
          {putsPoolFiltered &&
            putsPoolFiltered.map(
              ({ duration, pool }: FilteredPoolsInterface, index) => {
                return (
                  <PoolCard
                    key={index}
                    underlying={pool['underlying'] ?? ''}
                    depositToken={pool['base'] ?? ''}
                    duration={duration.toUpperCase()}
                    tvl={pool['tvl']}
                    apy={pool['apy']}
                    isPut={true}
                    retired={pool['retired'] ?? false}
                    version={pool['version'] ?? 0}
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

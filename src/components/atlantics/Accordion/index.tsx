import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import cx from 'classnames';

import Typography from 'components/UI/Typography';
import PoolCard from '../Pool';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import styles from './styles.module.scss';
import formatAmount from 'utils/general/formatAmount';

interface CustomAccordionProps {
  className: string;
  header: string;
  stats: { [key: string]: BigNumber } | undefined;
  pools?: {
    poolType: string;
    underlying: string;
    isPut: boolean;
    tvl: BigNumber;
    epochLength: 'daily' | 'monthly' | 'weekly';
  }[];
}

const CustomAccordion = ({
  header,
  stats,
  pools,
  className,
}: // expanded = true,
CustomAccordionProps) => {
  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      className={cx(className, styles['accordion'])}
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
          <Typography variant="h5" className="text-white">
            {header}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails className="rounded-2xl space-y-4">
        <Box className="flex my-4 space-x-3">
          {Object.keys(stats!).map((key: string, index: number) => {
            return (
              <Box
                key={index}
                className="rounded-lg bg-umbra w-1/2 p-2 space-y-2"
              >
                <Typography variant="h6">
                  $
                  {formatAmount(
                    // @ts-ignore todo: FIX
                    getUserReadableAmount(stats[key]!, 18),
                    3,
                    true,
                    true
                  )}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  {key[0]!.toUpperCase() + key.substring(1)}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Box className="flex flex-col space-y-4">
          {pools!.map((pool, index) => {
            return (
              <PoolCard
                key={index}
                tokenId={header}
                poolType={pool.poolType}
                underlying={pool.underlying}
                isPut={pool.isPut}
                epochLength={pool.epochLength}
                deposits={pool.tvl}
              />
            );
          })}
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

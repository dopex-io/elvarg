import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Typography from '../Typography';

interface Props {
  summary: string;
  details: string;
  footer: string;
}

export default function Accordion(props: Props) {
  const { summary, details, footer } = props;

  return (
    <MuiAccordion className="bg-cod-gray shadow-none border border-umbra rounded-xl">
      <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon className="text-mineshaft" />}
        classes={{ content: 'my-4' }}
      >
        <Typography variant="caption" component="h6" className="text-white">
          {summary}
        </Typography>
      </MuiAccordionSummary>
      <MuiAccordionDetails className="pt-0 flex-col">
        <Typography
          variant="caption"
          component="h6"
          className="text-stieglitz mb-4"
        >
          {details}
        </Typography>
        <Typography variant="caption" component="h6" className="text-wave-blue">
          {footer}
        </Typography>
      </MuiAccordionDetails>
    </MuiAccordion>
  );
}

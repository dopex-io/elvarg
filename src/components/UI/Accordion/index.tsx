import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Typography from '../Typography';

export default function Accordion(props) {
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

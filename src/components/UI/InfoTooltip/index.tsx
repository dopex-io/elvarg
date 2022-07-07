import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

interface Props extends Omit<TooltipProps, 'children'> {
  iconClassName?: string;
}

const InfoTooltip = (props: Props) => {
  return (
    <Tooltip {...props}>
      <InfoIcon className={props.iconClassName || ''} />
    </Tooltip>
  );
};

export default InfoTooltip;

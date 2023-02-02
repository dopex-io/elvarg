import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

interface Props extends Omit<TooltipProps, 'children'> {
  iconClassName?: string;
}

const InfoTooltip = (props: Props) => {
  const { iconClassName, ...rest } = props;
  return (
    <Tooltip {...rest}>
      <InfoIcon className={iconClassName || ''} />
    </Tooltip>
  );
};

export default InfoTooltip;

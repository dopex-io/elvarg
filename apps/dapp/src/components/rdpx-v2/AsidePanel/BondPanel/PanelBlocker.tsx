import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import Typography2 from 'components/UI/Typography2';

interface Props {
  title: string;
  body: string;
}

const PanelBlocker = (props: Props) => {
  return (
    <div className="flex flex-col space-y-3 absolute left-3 top-3 z-10 w-[93.5%] h-[96.5%] p-2 backdrop-blur-md border border-jaffa rounded-lg text-center justify-center">
      <div className="flex space-x-2 justify-center">
        <ExclamationTriangleIcon className="w-5 h-5 fill-current text-jaffa" />
        <Typography2 variant="body2">{props.title}</Typography2>
      </div>
      <Typography2 variant="caption" color="stieglitz">
        {props.body}
      </Typography2>
    </div>
  );
};

export default PanelBlocker;

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import Typography2 from 'components/UI/Typography2';

interface Props {
  url: string;
}

const ContractLink = ({ url }: Props) => {
  return (
    <div className="flex justify-end">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex space-x-1"
      >
        <Typography2 variant="caption" weight="400" color="stieglitz">
          Contract
        </Typography2>
        <ArrowTopRightOnSquareIcon className="w-4 h-4 fill-current text-stieglitz" />
      </a>
    </div>
  );
};

export default ContractLink;

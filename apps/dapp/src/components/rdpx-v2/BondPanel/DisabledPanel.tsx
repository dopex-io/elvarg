import CircularProgress from '@mui/material/CircularProgress';

import { useBoundStore } from 'store';

import AlertIcon from 'svgs/icons/AlertIcon';

interface Props {
  displayKey: string;
}

const popupText: Record<string, Record<string, string>> = {
  mint: {
    title: '$dpxETH Price Too Low',
    description:
      'Minting is only available when $dpxETH trades above 0.985. Consider buying $dpxETH on Curve.',
    link: 'https://app.dopex.io/ssov',
  },
  redeem: {
    title: '$dpxETH Price Too High',
    description:
      'Redemptions are only available when $dpxETH trades below 1.01. Consider selling $dpxETH on Curve.',
    link: 'https://app.dopex.io/ssov',
  },
  connect: {
    title: 'Connect Wallet',
    description: 'Please connect your wallet to interact with the app.',
    link: '',
  },
};

const DisabledPanel = (props: Props) => {
  const { displayKey } = props;

  const { isLoading } = useBoundStore();

  return (
    <div className="z-10 absolute top-0 flex flex-col h-full backdrop-blur-md text-center border rounded-xl bg-transparent border-[#F09242] p-3 space-y-2 justify-center w-full">
      {!isLoading ? (
        <>
          <div className="flex w-2/3 self-center justify-center space-x-2">
            <AlertIcon className="my-auto" />
            <span className="text-sm my-auto">
              {popupText[displayKey]?.['title']}
            </span>
          </div>
          <span className="text-xs my-auto">
            {popupText[displayKey]?.['description']}
          </span>
          <a
            className="text-xs text-wave-blue"
            href={popupText[displayKey]?.['link']}
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn Why
          </a>
        </>
      ) : (
        <CircularProgress size="30px" className="mx-auto" />
      )}
    </div>
  );
};

export default DisabledPanel;

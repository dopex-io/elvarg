import React from 'react';

import { CheckIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Meta } from '@storybook/react';

import InsuredPerpsIcon from '../src/icons/InsuredPerpsIcon';
import LongStraddleIcon from '../src/icons/LongStraddleIcon';
import PegHedgeIcon from '../src/icons/PegHedgeIcon';
import Menu from '../src/Menu';

const meta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
};

export default meta;

type ItemType = {
  textContent: string;
  icon?: boolean | JSX.Element;
  disabled?: boolean;
};

export const Variant = () => {
  const data: ItemType[] = [
    {
      textContent: 'Menu Item 1',
      icon: <LongStraddleIcon />,
      disabled: false,
    },
    {
      textContent: 'Menu Item 2',
      icon: <InsuredPerpsIcon />,
      disabled: false,
    },
    {
      textContent: 'Menu Item 3',
      icon: <PegHedgeIcon />,
      disabled: true,
    },
  ];

  const [selection, setSelection] = React.useState<ItemType>(data[0]);
  const [copy, setCopy] = React.useState<boolean>(false);

  const copyText = 'Lorem Ipsum';

  const handleCopy = React.useCallback(() => {
    setCopy(true);
    navigator.clipboard.writeText(copyText);
    setInterval(() => setCopy(false), 1000);
  }, []);

  const topElement = React.useMemo(() => {
    return (
      <div className="flex justify-between bg-inherit rounded-t-md border-b border-red-800 p-2">
        <div className="p-1 rounded-md bg-black bg-opacity-20">
          <span className="text-xs text-white">{copyText}</span>
        </div>
        <button
          onClick={handleCopy}
          className="py-1 px-2 rounded-md bg-black bg-opacity-20 hover:bg-opacity-75 text-white"
        >
          {copy ? (
            <CheckIcon className="w-[12px] text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="w-[12px]" />
          )}
        </button>
      </div>
    );
  }, [copy]);

  return (
    <div className="grid grid-flow-row grid-cols-2 text-left min-w-screen w-1/2 h-[450px] bg-black">
      <div className="m-3 flex flex-col text-white">
        Full height
        <Menu<ItemType>
          data={data.concat(data)}
          selection={selection}
          setSelection={setSelection}
          showArrow
        />
      </div>
      <div className="m-3 flex flex-col text-white">
        Icon
        <Menu
          data={data}
          selection={selection}
          setSelection={setSelection}
          dropdownVariant="icon"
        />
      </div>
      <div className="m-3 flex flex-col text-white">
        Dense
        <Menu
          data={data.concat(data)}
          selection={selection}
          dropdownVariant="dense"
          setSelection={setSelection}
          scrollable
        />
      </div>
      <div className="m-3 flex flex-col text-white">
        Custom
        <Menu
          topElement={topElement}
          data={data.concat(data)}
          selection={selection}
          setSelection={setSelection}
          color="primary"
          fullWidth
          scrollable
          showArrow
          className="bg-primary rounded-[10px] w-full"
        />
      </div>
    </div>
  );
};

import React from "react";
import { ComponentMeta } from "@storybook/react";

import Menu from "../src/Menu";
import PegHedgeIcon from "../src/icons/PegHedgeIcon";
import InsuredPerpsIcon from "../src/icons/InsuredPerpsIcon";
import LongStraddleIcon from "../src/icons/LongStraddleIcon";
import ContentCopyIcon from "../src/icons/ContentCopyIcon";
import CheckedIcon from "../src/icons/CheckedIcon";

const meta: ComponentMeta<typeof Menu> = {
  title: "Menu",
  component: Menu,
};

export default meta;

type ItemType = {
  textContent: string;
  icon?: boolean | JSX.Element;
  disabled?: boolean;
};

export const Variant = () => {
  const handleSelection = (e: any) => {
    setSelection(e.target.textContent);
  };

  const data: ItemType[] = [
    {
      textContent: "Menu Item 1",
      icon: <LongStraddleIcon />,
      disabled: false,
    },
    {
      textContent: "Menu Item 2",
      icon: <InsuredPerpsIcon />,
      disabled: false,
    },
    {
      textContent: "Menu Item 3",
      icon: <PegHedgeIcon />,
      disabled: true,
    },
  ];

  const [selection, setSelection] = React.useState<any>(data[0].textContent);
  const [copy, setCopy] = React.useState<boolean>(false);

  const copyText = "Lorem Ipsum";

  const handleCopy = React.useCallback(() => {
    setCopy(true);
    navigator.clipboard.writeText(copyText);
    setInterval(() => setCopy(false), 1000);
  }, []);

  const topElement = React.useMemo(() => {
    return (
      <div className="flex justify-between bg-umbra rounded-t-md border-b border-carbon p-2">
        <div className="p-1 rounded-md bg-mineshaft">
          <span className="text-xs text-white">{copyText}</span>
        </div>
        <button
          onClick={handleCopy}
          className="py-1 px-2 rounded-md bg-mineshaft hover:bg-opacity-70 text-white"
        >
          {copy ? (
            <CheckedIcon className="w-[12px]" />
          ) : (
            <ContentCopyIcon className="w-[12px]" />
          )}
        </button>
      </div>
    );
  }, [copy]);

  return (
    <div className="grid grid-flow-row grid-cols-2 text-left min-w-screen w-1/2 h-[450px] bg-black">
      <div className="m-3">
        <Menu<ItemType>
          data={data}
          selection={selection}
          handleSelection={handleSelection}
        />
      </div>
      <div className="m-3">
        <Menu
          data={data}
          selection={selection}
          dropdownVariant="icon"
          handleSelection={handleSelection}
        />
      </div>
      <div className="m-3">
        <Menu
          data={data.concat(data)}
          selection={selection}
          dropdownVariant="dense"
          handleSelection={handleSelection}
          scrollable
        />
      </div>
      <div className="m-3">
        <Menu
          topElement={topElement}
          data={data.concat(data)}
          selection={selection}
          handleSelection={handleSelection}
          scrollable
        />
      </div>
    </div>
  );
};

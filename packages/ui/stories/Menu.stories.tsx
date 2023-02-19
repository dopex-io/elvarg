import React from "react";
import { ComponentMeta } from "@storybook/react";

import Menu from "../src/Menu";
import PegHedgeIcon from "../src/miscellaneous/icons/PegHedgeIcon";
import InsuredPerpsIcon from "../src/miscellaneous/icons/InsuredPerpsIcon";
import LongStraddleIcon from "../src/miscellaneous/icons/LongStraddleIcon";

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

  return (
    <div className="grid grid-flow-row grid-cols-2 text-right min-w-screen w-fit">
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
    </div>
  );
};

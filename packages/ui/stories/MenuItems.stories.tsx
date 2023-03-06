import MenuItems, {  ItemType } from "../src/MenuItems";
import InsuredPerpsIcon from "../src/icons/InsuredPerpsIcon";
import LongStraddleIcon from "../src/icons/LongStraddleIcon";
import PegHedgeIcon from "../src/icons/PegHedgeIcon";
import {  Menu as HeadlessMenu } from "@headlessui/react";
import {  ComponentMeta } from "@storybook/react";
import React from "react";

const meta: ComponentMeta<typeof MenuItems> = {
  title: "MenuItem",
  component: MenuItems,
};

export default meta;

export const Variant = () => {
  const data: ItemType[] = [
    {
      textContent: "Menu Item 1",
      icon: <LongStraddleIcon />,
      disabled: false,
    },
    {
      textContent: "Menu Item 2",
      icon: <PegHedgeIcon />,
      disabled: false,
    },
    {
      textContent: "Menu Item 3",
      icon: <InsuredPerpsIcon />,
      disabled: true,
    },
  ];

  return (
    <div className="container grid grid-flow-row grid-cols-2 w-1/2 h-[450px] bg-black">
      <div className="m-4">
        <p className="text-white text-xl text-left">Basic</p>
        <HeadlessMenu as="div" className="inline-block text-left">
          <MenuItems
            variant="basic"
            data={data}
            handleSelection={(e) => console.log(e.currentTarget.textContent)}
            static
          />
        </HeadlessMenu>
      </div>
      <div className="m-4">
        <p className="text-white text-xl text-left">Icon</p>
        <HeadlessMenu as="div" className="inline-block text-left">
          <MenuItems
            variant="icon"
            data={data}
            handleSelection={(e) => console.log(e.currentTarget.textContent)}
            static
          />
        </HeadlessMenu>
      </div>
      <div className="m-4">
        <p className="text-white text-xl text-left">Dense</p>
        <HeadlessMenu
          as="div"
          className="absolute inline-block text-left top-1000"
        >
          <MenuItems
            variant="dense"
            data={data}
            handleSelection={(e) => console.log(e.currentTarget.textContent)}
            static
          />
        </HeadlessMenu>
      </div>
      <div className="m-4">
        <p className="text-white text-xl text-left">Scrollable</p>
        <HeadlessMenu
          as="div"
          className="absolute inline-block text-left top-1000"
        >
          <MenuItems
            variant="dense"
            data={data.concat(data)}
            handleSelection={(e) => console.log(e.currentTarget.textContent)}
            scrollable
            static
          />
        </HeadlessMenu>
      </div>
    </div>
  );
};

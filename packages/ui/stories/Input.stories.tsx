import React, { useCallback } from "react";
import { ComponentMeta } from "@storybook/react";

import Input from "../src/Input";
import Menu from "../src/Menu";
import MenuItems from "../src/MenuItems";
import Usdc from "../src/icons/Usdc";

const meta: ComponentMeta<typeof Input> = {
  title: "Input",
  component: Input,
};

export default meta;

export const Default = () => {
  const amount = 25;
  const handleChange = useCallback(() => {
    console.log("Handle");
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 bg-cod-gray p-32">
        <Input
          variant="default"
          handleChange={handleChange}
          leftElement={
            <Usdc className="h-12 w-auto border border-mineshaft rounded-full" />
          }
          bottomElement={
            <div className="flex font-sans justify-between my-auto">
              <span className="text-stieglitz text-sm">Balance</span>
              <span className="text-white text-sm">{amount}</span>
            </div>
          }
          placeholder="0.0"
        />
      </div>
    </div>
  );
};

type ItemType = {
  textContent: string;
  icon?: boolean | JSX.Element;
  disabled?: boolean;
};

export const Variant = () => {
  const amount = 25;

  const data: ItemType[] = [
    {
      textContent: "USDC",
      icon: (
        <Usdc className="h-6 w-auto border border-mineshaft rounded-full" />
      ),
      disabled: false,
    },
  ];

  const [selection, setSelection] = React.useState<any>(data[0].textContent);

  const handleSelection = (e: any) => {
    setSelection(e.target.textContent);
  };

  const handleChange = useCallback(() => {
    console.log("Handle");
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 bg-cod-gray p-32 flex flex-col space-y-8">
        <Input
          variant="variant1"
          color="cod-gray"
          outline="umbra"
          handleChange={handleChange}
          placeholder="Small"
        />
        <Input
          variant="variant1"
          color="umbra"
          handleChange={handleChange}
          placeholder="Small"
        />
        <Input
          variant="variant2"
          color="cod-gray"
          outline="umbra"
          handleChange={handleChange}
          placeholder="Medium"
        />
        <Input
          variant="variant2"
          color="umbra"
          handleChange={handleChange}
          placeholder="Medium"
        />
        <Input
          variant="default"
          color="umbra"
          outline="mineshaft"
          handleChange={handleChange}
          placeholder="XL"
        />
        <Input
          variant="default"
          handleChange={handleChange}
          leftElement={
            <Usdc className="h-12 w-auto border border-mineshaft rounded-full" />
          }
          bottomElement={
            <div className="flex font-sans justify-between my-auto">
              <span className="text-stieglitz text-sm">Balance</span>
              <span className="text-white text-sm">{amount}</span>
            </div>
          }
          placeholder="XL"
        />
        <Input
          variant="default"
          handleChange={handleChange}
          leftElement={
            <div>
              <Menu
                data={data}
                selection={selection}
                dropdownVariant="icon"
                handleSelection={handleSelection}
              />
            </div>
          }
          bottomElement={
            <div className="flex font-sans justify-between my-auto">
              <span className="text-stieglitz text-sm">Balance</span>
              <span className="text-white text-sm">{amount}</span>
            </div>
          }
          placeholder="XL"
          outline="down-bad"
        />
      </div>
    </div>
  );
};

export const Outlines = () => {
  const handleChange = useCallback(() => {
    console.log("Handle");
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 bg-cod-gray p-32 flex flex-col space-y-8">
        <Input
          variant="variant1"
          handleChange={handleChange}
          placeholder="Outlined"
        />
        <Input
          variant="variant1"
          color="cod-gray"
          outline="down-bad"
          handleChange={handleChange}
          placeholder="Validation"
        />
        <Input
          variant="default"
          color="cod-gray"
          outline="down-bad"
          handleChange={handleChange}
          placeholder="Validation"
        />
        <Input
          variant="default"
          outline="down-bad"
          leftElement={
            <Usdc className="h-12 w-auto border border-mineshaft rounded-full" />
          }
          handleChange={handleChange}
          placeholder="Validation"
          bottomElement={
            <div className="flex font-sans justify-between my-auto">
              <span className="text-stieglitz text-sm">Balance</span>
              <span className="text-white text-sm">{25}</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

import React, { useCallback } from "react";
import { ComponentMeta } from "@storybook/react";

import Input from "../src/Input";
import Menu from "../src/Menu";
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
          variant="xl"
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
          variant="small"
          color="cod-gray"
          outline="umbra"
          handleChange={handleChange}
          placeholder="Small"
        />
        <Input
          variant="small"
          color="umbra"
          handleChange={handleChange}
          placeholder="Small"
        />
        <Input
          variant="medium"
          color="cod-gray"
          outline="umbra"
          handleChange={handleChange}
          placeholder="Medium"
        />
        <Input
          variant="medium"
          color="cod-gray"
          outline="umbra"
          handleChange={handleChange}
          placeholder="Medium"
        />
        <Input
          variant="medium"
          color="umbra"
          rightElement={
            <Menu
              data={data}
              selection={selection}
              dropdownVariant="icon"
              color="umbra"
              handleSelection={handleSelection}
            />
          }
          handleChange={handleChange}
          placeholder="Medium"
        />
        <Input
          variant="xl"
          color="umbra"
          outline="mineshaft"
          handleChange={handleChange}
          placeholder="XL"
        />
        <Input
          variant="xl"
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
          variant="xl"
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
          variant="small"
          outline="mineshaft"
          handleChange={handleChange}
          placeholder="Outlined"
        />
        <Input
          variant="small"
          outline="umbra"
          color="cod-gray"
          handleChange={handleChange}
          placeholder="Outlined"
        />
        <Input
          variant="small"
          color="cod-gray"
          outline="down-bad"
          handleChange={handleChange}
          placeholder="Validation"
        />
        <Input
          variant="xl"
          color="cod-gray"
          outline="down-bad"
          handleChange={handleChange}
          placeholder="Validation"
        />
        <Input
          variant="xl"
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

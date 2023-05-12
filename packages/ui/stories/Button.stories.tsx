import React from "react";
import { Meta } from "@storybook/react";

import Button from "../src/Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
};

export default meta;

const Template = (args) => {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      {args.array.map((item) => {
        return (
          <Button className="capitalize" {...{ [args.propName]: item }}>
            {item}
          </Button>
        );
      })}
    </div>
  );
};

// 👇 Each story then reuses that template
export const Variant = Template.bind({});
Variant.args = {
  propName: "variant",
  array: ["contained", "outlined", "text"],
};

export const Color = Template.bind({});
Color.args = {
  propName: "color",
  array: ["primary", "mineshaft", "umbra", "carbon", "error", "success"],
};

export const Size = Template.bind({});
Size.args = { propName: "size", array: ["xsmall", "small", "medium", "large"] };

export const Disabled = () => {
  return (
    <div>
      <Button disabled>Disabled</Button>
    </div>
  );
};

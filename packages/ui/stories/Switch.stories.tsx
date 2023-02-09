import React from "react";
import { ComponentMeta } from "@storybook/react";

import Switch from "../src/Switch";

const meta: ComponentMeta<typeof Switch> = {
  title: "Switch",
  component: Switch,
};

export default meta;

export const Default = () => {
  const [checked, setChecked] = React.useState(false);

  const onChange = () => {
    setChecked((c) => !c);
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <Switch checked={checked} onChange={onChange} />
      <Switch checked={checked} onChange={onChange} size="medium" />
    </div>
  );
};

export const Colors = () => {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <Switch checked />
      <Switch checked color="jaffa" />
      <Switch checked color="mineshaft" />
    </div>
  );
};

export const Disabled = () => {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <Switch disabled />
    </div>
  );
};

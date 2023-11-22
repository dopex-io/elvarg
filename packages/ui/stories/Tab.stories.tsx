import Tabs from "../src/Tab";
import TabHeader from "../src/TabHeader";
import { Meta } from "@storybook/react";
import React from "react";

export default {
  title: "Tabs",
  component: Tabs,
} as Meta<typeof Tabs>;

const Template = (args) => {
  return (
    <div className="max-w-md px-2 py-16 sm:px-0">
      {args.array.map((size) => {
        return (
          <Tabs size={size}>
            <TabHeader>item one</TabHeader>
            <TabHeader>item two</TabHeader>
            <TabHeader>item three</TabHeader>
          </Tabs>
        );
      })}
    </div>
  );
};

export const Sizes = Template.bind({});
Sizes.args = {
  array: ["large", "medium", "small"],
};

export const Disabled = () => {
  return (
    <div className="max-w-md px-2 py-16 sm:px-0">
      <Tabs>
        <TabHeader>item one</TabHeader>
        <TabHeader disabled>item two</TabHeader>
        <TabHeader>item three</TabHeader>
      </Tabs>
    </div>
  );
};

import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Tabs from "../src/Tabs";

export default {
  title: "Tabs",
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template = (args) => {
  return (
    <div className="max-w-md px-2 py-16 sm:px-0">
      {args.array.map((size) => {
        return <Tabs categories={args.categories} size={size} />;
      })}
    </div>
  );
};

export const Sizes = Template.bind({});
Sizes.args = {
  categories: {
    "item one head": "item one panel",
    "item two head": "item two panel",
    "item three head": "item three panel",
  },
  array: ["large", "medium", "small"],
};

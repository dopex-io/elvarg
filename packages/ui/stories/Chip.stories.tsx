import React from 'react';

import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Meta } from '@storybook/react';

import Chip from '../src/Chip';

const meta: Meta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
};

export default meta;

const Template = (args) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        padding: '24px',
      }}
      className="bg-cod-gray"
    >
      {args.array.map((item) => {
        return (
          <Chip className="capitalize" {...{ [args.propName]: item }}>
            {item}
          </Chip>
        );
      })}
    </div>
  );
};

export const Color = Template.bind({});
Color.args = {
  propName: 'color',
  array: ['primary', 'mineshaft', 'umbra', 'carbon', 'error', 'success'],
};

export const Size = Template.bind({});
Size.args = { propName: 'size', array: ['small', 'medium', 'large'] };

const HoverTemplate = (args) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        padding: '24px',
      }}
      className="bg-cod-gray"
    >
      {args.array.map((item) => {
        return (
          <Chip hover {...{ [args.propName]: item }}>
            {item}
          </Chip>
        );
      })}
    </div>
  );
};

export const Hover = HoverTemplate.bind({});
Hover.args = {
  propName: 'color',
  array: ['primary', 'mineshaft', 'umbra', 'carbon', 'error', 'success'],
};

export const Deletable = () => {
  const [hide, setHide] = React.useState(false);
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        padding: '24px',
      }}
      className="bg-cod-gray"
    >
      return (
      <Chip
        deletable
        hide={hide}
        handleDelete={() => {
          setHide(true);
        }}
      >
        Deletable
      </Chip>
      );
    </div>
  );
};

const AdornmentTemplate = (args) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        padding: '24px',
      }}
      className="bg-cod-gray"
    >
      {args.array.map((item) => {
        return (
          <Chip
            icon={<ArrowLeftIcon className="text-white w-4" />}
            {...{ [args.propName]: item }}
          >
            Icon
          </Chip>
        );
      })}
    </div>
  );
};

export const Adornment = AdornmentTemplate.bind({});
Adornment.args = { propName: 'size', array: ['small', 'medium', 'large'] };

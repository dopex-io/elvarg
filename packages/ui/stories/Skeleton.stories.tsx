import React from 'react';

import { Meta } from '@storybook/react';

import Skeleton from '../src/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
};

export default meta;

export const Rectangular = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
      }}
    >
      <Skeleton />
    </div>
  );
};

export const Rounded = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
      }}
    >
      <Skeleton variant="rounded" />
    </div>
  );
};

export const Circular = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
      }}
    >
      <Skeleton variant="circular" />
    </div>
  );
};

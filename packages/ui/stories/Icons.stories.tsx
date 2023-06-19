import React from 'react';

import { Meta } from '@storybook/react';

import InsuredPerpsIcon from '../src/icons/InsuredPerpsIcon';
import LongStraddleIcon from '../src/icons/LongStraddleIcon';
import PegHedgeIcon from '../src/icons/PegHedgeIcon';

const meta: Meta<typeof InsuredPerpsIcon> = {
  title: 'Icons',
  component: InsuredPerpsIcon,
};

export default meta;

export const Default = () => {
  return (
    <div>
      <InsuredPerpsIcon />
      <LongStraddleIcon />
      <PegHedgeIcon />
    </div>
  );
};

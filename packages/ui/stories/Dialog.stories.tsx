import React, { useState } from 'react';

import { Meta } from '@storybook/react';

import Button from '../src/Button';
import Dialog from '../src/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
};

export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog
        title="Purchase"
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        showCloseIcon
      >
        <div className="text-stieglitz">Purchase options here</div>
      </Dialog>
    </div>
  );
};

export const WithoutCloseIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Dialog
        title="Purchase"
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        <div className="text-stieglitz">Without close icon</div>
      </Dialog>
    </div>
  );
};

import React from 'react';

import { Button } from '@dopex-io/ui';

const MultiExerciseButton = () => {
  const positions = {
    size: 3,
  };
  const handleMultiExercise = () => {};
  return (
    <Button
      className="text-xs"
      size="xsmall"
      disabled={positions.size < 2}
      onClick={handleMultiExercise}
    >
      Exercise All
    </Button>
  );
};

export default MultiExerciseButton;

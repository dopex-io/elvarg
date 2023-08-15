import React from 'react';

import { Button } from '@dopex-io/ui';

export function OptionType() {
  const [isPut, setIsPut] = React.useState(false);

  return (
    <div>
      <h3>Option Type</h3>
      <div className="flex gap-4 mt-2">
        <Button
          id="clamm-call-option-typ"
          color={!isPut ? 'primary' : 'mineshaft'}
          onClick={() => setIsPut(false)}
          className="w-20"
        >
          Call
        </Button>
        <Button
          id="clamm-put-option-typ"
          color={isPut ? 'primary' : 'mineshaft'}
          onClick={() => setIsPut(true)}
          className="w-20"
        >
          Put
        </Button>
      </div>
    </div>
  );
}

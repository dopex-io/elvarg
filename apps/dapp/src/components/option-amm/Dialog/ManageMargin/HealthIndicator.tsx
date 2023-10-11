import React from 'react';
import { formatUnits, parseUnits } from 'viem';

import getHighlightingFromRisk from 'utils/optionAmm/getHighlightingFromRisk';
import getMMSeverity from 'utils/optionAmm/getMMSeverity';

interface Props {
  health: bigint;
  newHealth: string;
  liquidationThreshold: bigint;
  amount: string;
}

const HealthIndicator = (props: Props) => {
  const { health, newHealth, liquidationThreshold, amount } = props;

  return (
    <div className="flex justify-between text-xs p-3">
      <p className="text-stieglitz">Portfolio Health</p>
      <span className="flex space-x-2">
        <p
          className={`text-${getHighlightingFromRisk(
            getMMSeverity(health || 0n, liquidationThreshold || 0n),
          )}`}
        >
          {formatUnits(health || 0n, 2)}%
        </p>
        {amount !== '' && amount !== '0' ? (
          <>
            <p>→</p>
            <p
              className={`text-${
                newHealth === null
                  ? 'stieglitz'
                  : getHighlightingFromRisk(
                      getMMSeverity(
                        parseUnits(newHealth, 3),
                        liquidationThreshold || 0n,
                      ),
                    )
              }`}
            >
              {newHealth}
            </p>
          </>
        ) : null}
      </span>
    </div>
  );
};

export default HealthIndicator;

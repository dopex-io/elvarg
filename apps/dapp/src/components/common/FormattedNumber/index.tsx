import React, { HTMLAttributes, useMemo } from 'react';

import { formatAmount } from 'utils/general';

type Props = {
  amount: string;
  precision: number;
} & HTMLAttributes<HTMLParagraphElement>;

const FormattedNumber = ({ amount, precision }: Props) => {
  const parsed = useMemo(() => {
    if (Number(amount) > 0.0001) {
      return {
        amount,
        sub: 0,
      };
    }
    const search = /(?!0)\d+/;
    const start = amount.search(search);
    if (start === -1) {
      return {
        amount: '0',
        sub: 0,
      };
    }
    const remaining = amount.substring(start, start + precision);
    return {
      amount: remaining,
      sub: start - 2,
    };
  }, [amount, precision]);
  return (
    <p>
      {parsed.amount === '0' ? (
        0
      ) : parsed.sub === 0 ? (
        formatAmount(parsed.amount, precision)
      ) : (
        <>
          0.0<sub className="text-[0.6em]">{parsed.sub}</sub>
          {parsed.amount}
        </>
      )}
    </p>
  );
};

export default FormattedNumber;

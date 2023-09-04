const popovers = ['info', 'warning', 'error'] as const;
type PopoverType = (typeof popovers)[number];

type PopoverContent = {
  disabled: boolean;
  alertBg: string;
  textContent: string;
  buttonContent?: string;
  icon?: React.ReactNode;
};

const alertsMapping: Record<PopoverType, Record<string, PopoverContent>> = {
  info: {
    enabled: {
      disabled: false,
      textContent: '',
      alertBg: 'bg-mineshaft text-white',
    },
    insufficientLiquidity: {
      disabled: true,
      textContent: 'Insufficient Liquidity',
      alertBg: 'bg-mineshaft text-white',
      buttonContent: 'Purchase',
    },
    emptyInput: {
      disabled: true,
      textContent: 'Enter an amount',
      alertBg: 'bg-mineshaft text-white',
    },
  },
  warning: {
    highIv: {
      disabled: false,
      textContent: 'IV is currently high.',
      alertBg: 'bg-jaffa text-cod-gray',
    },
  },
  error: {
    insufficientBalance: {
      disabled: true,
      textContent: 'Insufficient Balance.',
      alertBg: 'bg-down-bad text-cod-gray',
    },
    insufficientAllowance: {
      disabled: false,
      textContent: 'Insufficient allowance. Please approve your token.',
      alertBg: 'bg-down-bad text-cod-gray',
      buttonContent: 'Approve',
    },
    fallback: {
      disabled: true,
      textContent: '',
      alertBg: 'bg-down-bad',
    },
  },
};

export default alertsMapping;

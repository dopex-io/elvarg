const popovers = ['info', 'warning', 'error'] as const;
type PopoverType = (typeof popovers)[number];

type PopoverContent = {
  disabled: boolean;
  alertBg: string;
  header: string;
  body?: string;
  buttonContent?: string;
  icon?: React.ReactNode;
};

const alertsMapping: Record<PopoverType, Record<string, PopoverContent>> = {
  info: {
    enabled: {
      disabled: false,
      header: '',
      alertBg: 'bg-mineshaft text-white',
    },
    insufficientLiquidity: {
      disabled: true,
      header: 'Insufficient Liquidity',
      alertBg: 'bg-mineshaft text-white',
      buttonContent: 'Purchase',
    },
    emptyInput: {
      disabled: true,
      header: 'Enter an amount',
      alertBg: 'bg-mineshaft text-white',
    },
  },
  warning: {
    highIv: {
      disabled: false,
      header: 'IV is currently high',
      alertBg: 'bg-jaffa text-cod-gray',
    },
  },
  error: {
    insufficientBalance: {
      disabled: true,
      header: 'Insufficient Balance',
      alertBg: 'bg-down-bad text-cod-gray',
    },
    insufficientAllowance: {
      disabled: false,
      header: 'Token Approval Required',
      alertBg: 'bg-down-bad text-cod-gray',
      buttonContent: 'Approve',
    },
    fallback: {
      disabled: true,
      header: '',
      alertBg: 'bg-down-bad',
    },
  },
};

export default alertsMapping;

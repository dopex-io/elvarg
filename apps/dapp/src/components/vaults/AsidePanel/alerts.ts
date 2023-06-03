const alerts: {
  status: string | undefined;
  disabled: boolean;
  textContent: string | undefined;
  alertBg: string | undefined;
  buttonContent?: string | undefined;
}[] = [
  {
    status: 'normal',
    disabled: true,
    textContent: 'Disabled',
    alertBg: 'bg-mineshaft',
  }, // 0
  {
    status: 'error',
    disabled: true,
    textContent: 'Insufficient Balance',
    alertBg: 'bg-down-bad',
  }, // 1
  {
    status: 'error',
    disabled: false,
    textContent: 'Insufficient allowance',
    alertBg: 'bg-down-bad',
    buttonContent: 'Approve',
  }, // 2
  {
    status: 'error',
    disabled: false,
    textContent: 'Insufficient allowance',
    alertBg: 'bg-down-bad',
    buttonContent: 'Approve',
  }, // 3
  {
    status: 'warning',
    disabled: false,
    textContent: 'IV is currently high.',
    alertBg: 'bg-mineshaft',
  }, // 4
  {
    status: 'info',
    disabled: true,
    textContent: 'Insufficient Liquidity',
    alertBg: 'bg-jaffa',
    buttonContent: 'Purchase',
  }, // 5
  {
    status: undefined,
    disabled: false,
    alertBg: undefined,
    textContent: undefined,
  }, // 6
];

export default alerts;

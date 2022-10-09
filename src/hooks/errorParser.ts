import { OLP_ERROS } from 'constants/errors';

const START_OFFSET: number = 1;
const END_OFFSET: number = 2;

const errorParser = (message: string) => {
  const start = message.indexOf('"code":-32603');
  const end = message.indexOf('code=UNPREDICTABLE_GAS_LIMIT');
  const jsonError = JSON.parse(
    message.substring(start - START_OFFSET, end - END_OFFSET)
  );

  const reason = jsonError.message;

  if (reason.includes('allowance')) {
    return 'You did not approve enough';
  } else if (reason.includes('exceeds balance')) {
    return 'You are trying to transfer more than you have';
  }

  let displayError: string = 'Unknown error';

  try {
    const contractReason = jsonError.data.originalError.data;
    displayError = OLP_ERROS[contractReason]!;
  } catch (err) {
    console.log(err);
  }
  return displayError;
};

export default errorParser;

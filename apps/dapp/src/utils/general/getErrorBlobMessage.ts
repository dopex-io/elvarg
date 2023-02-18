import { CONTRACT_ERRORS } from 'constants/errors';

const START_OFFSET: number = 1;
const END_OFFSET: number = 2;

const getErrorBlobMessage = (message: string) => {
  console.log('enter 1');

  // check if it's BigNumber error
  if (message.includes('BigNumber')) {
    return 'Invalid input';
  }

  try {
    const start = message.indexOf('"code":-32603');
    const end = message.indexOf('code=UNPREDICTABLE_GAS_LIMIT');

    const jsonError = JSON.parse(
      message.substring(start - START_OFFSET, end - END_OFFSET)
    );

    const reason = jsonError.data.data;

    let displayError: string = reason;

    if (reason.includes('allowance')) {
      return 'You did not approve enough';
    } else if (reason.includes('exceeds balance')) {
      return 'You are trying to transfer more than you have';
    }

    try {
      console.log('reason: ', reason);
      displayError =
        CONTRACT_ERRORS[reason.toString()] ?? jsonError.data.message;
    } catch (err) {
      console.log(err);
    }
    return displayError;
  } catch (err) {
    return message;
  }
};

export default getErrorBlobMessage;

import { getMessageFromCode } from 'eth-rpc-errors';

import errorCodes from 'constants/errors.json';

// @ts-ignore TODO: FIX
const parseError = (err) => {
  try {
    const parsedError = err.data.message.match(/(E\d+)/)[1];
    // @ts-ignore TODO: FIX
    return errorCodes[parsedError];
  } catch {
    return getMessageFromCode(err.code);
  }
};

export default parseError;

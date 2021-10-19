import { getMessageFromCode } from 'eth-rpc-errors';

import errorCodes from 'constants/errors.json';

const parseError = (err) => {
  try {
    const parsedError = err.data.message.match(/(E\d+)/)[1];
    return errorCodes[parsedError];
  } catch {
    return getMessageFromCode(err.code);
  }
};

export default parseError;

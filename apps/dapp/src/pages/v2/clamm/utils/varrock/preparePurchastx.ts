import axios from 'axios';

import { VARROCK_BASE_API_URL } from '../../constants';

async function preparePurchasTx() {
  axios.get(`${VARROCK_BASE_API_URL}/clamm/purchase`);
}

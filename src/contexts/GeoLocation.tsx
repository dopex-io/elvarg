// @ts-nocheck TODO: FIX
import { useEffect, useState } from 'react';
import axios from 'axios';

import { BLOCKED_COUNTRIES_ALPHA_2_CODES } from 'constants/index';

import { createContext } from 'react';

export const GeoLocationContext = createContext<any>({});

export const GeoLocationProvider = (props) => {
  const [state, setState] = useState({
    isOfac: false,
  });

  useEffect(() => {
    async function checkLocation() {
      try {
        const { data } = await axios.get(
          'https://www.cloudflare.com/cdn-cgi/trace'
        );
        const countryAlpha2Code = data.split('loc=')[1].substring(0, 2);
        if (BLOCKED_COUNTRIES_ALPHA_2_CODES.includes(countryAlpha2Code)) {
          setState({ isOfac: true });
        } else {
          setState({ isOfac: false });
        }
      } catch {
        setState({ isOfac: false });
      }
    }

    checkLocation();
  }, []);

  return (
    <GeoLocationContext.Provider value={state}>
      {props.children}
    </GeoLocationContext.Provider>
  );
};

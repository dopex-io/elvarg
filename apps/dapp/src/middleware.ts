import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const BLOCKED_COUNTRIES_ALPHA_2_CODES: string[] = [
  'US',
  'ZW',
  'YE',
  'CU',
  'IR',
  'KP',
  'RU',
  'SY',
  'BY',
  'MM',
  'CF',
  'CD',
  'ET',
  'IQ',
  'LB',
  'LY',
  'SD',
  'VE',
];

const unblockedUserAgents = ['Twitter', 'Telegram', 'Discord', 'Google'];

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent');

  let check = false;

  if (userAgent) {
    for (let i = 0; i < unblockedUserAgents.length; i++) {
      const unblockedUserAgent = unblockedUserAgents[i]!;

      if (userAgent.includes(unblockedUserAgent)) {
        check = false;
        break;
      }
      check = true;
    }
  }

  console.log(check, userAgent);

  if (check) {
    const country = req.geo?.country;

    if (country && BLOCKED_COUNTRIES_ALPHA_2_CODES.includes(country)) {
      req.nextUrl.pathname = '/blocked';
    }
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
}

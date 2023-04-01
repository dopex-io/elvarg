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

// Limit middleware pathname config
export const config = {
  matcher: '/',
};

export function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo?.country || 'US';

  // Specify the correct pathname
  if (BLOCKED_COUNTRIES_ALPHA_2_CODES.includes(country)) {
    req.nextUrl.pathname = '/blocked';
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
}

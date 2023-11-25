import { Metadata } from 'next';

import Narrow from 'components/layouts/Narrow';

export const metadata: Metadata = {
  title: 'Portfolio | Dopex',
  description: 'A one stop shop for all your option needs',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Narrow>{children}</Narrow>;
}

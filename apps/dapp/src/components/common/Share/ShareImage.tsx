import { ReactNode, forwardRef } from 'react';

import { QRCodeSVG } from 'qrcode.react';

interface StatProps {
  name: string;
  value: string;
}

export interface ShareImageProps {
  title: ReactNode;
  percentage: number;
  customPath?: string;
  stats: StatProps[];
}

const Stat = ({ name, value }: StatProps) => {
  return (
    <div className="flex flex-col">
      <h5 className="font-bold text-white">{name}</h5>
      <h3 className="text-2xl font-mono font-bold shadow-2xl text-white">
        {value}
      </h3>
    </div>
  );
};

const ShareImage = (
  { title, percentage, stats, customPath = '/' }: ShareImageProps,
  ref: any
) => {
  return (
    <div
      className="bg-[url('/images/misc/share-bg.png')] h-[309px] bg-contain bg-no-repeat pt-20 px-9"
      ref={ref}
    >
      <div className="flex w-full justify-between">
        <div>
          <div className="text-white">{title}</div>
          <h1
            className={`font-mono font-bold text-[48px] ${
              percentage > 0 ? 'text-up-only' : 'text-down-bad'
            }`}
          >
            {percentage.toFixed(2)}%
          </h1>
        </div>
        <div className="self-end justify-end shadow-2xl mt-[-16px]">
          <QRCodeSVG value={`https://app.dopex.io${customPath}`} />
        </div>
      </div>
      <div className="grid grid-cols-3 mt-6">
        {stats.map((s) => {
          return <Stat key={s.name} {...s} />;
        })}
      </div>
    </div>
  );
};

export default forwardRef(ShareImage);

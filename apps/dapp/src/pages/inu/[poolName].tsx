import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import PageLayout from 'components/common/PageLayout';
import Manage from 'components/inu/Manage';
import TradeCard from 'components/inu/TradeCard';

import seo from 'constants/seo';

const ManageComponent = () => {
  const [manageSection, setManageSection] = useState<string>('Trade');

  return (
    <div className="w-full !mt-4 h-fit-content">
      <ButtonGroup className="flex w-full justify-between bg-cod-gray border border-umbra rounded-top-lg mb-2">
        {['LP', 'Trade'].map((label, index) => (
          <Button
            key={index}
            className={`border-0 hover:border-0 w-full m-1 p-1 transition ease-in-out duration-500 ${
              manageSection === label
                ? 'text-white bg-carbon hover:bg-carbon'
                : 'text-stieglitz bg-transparent hover:bg-transparent'
            } hover:text-white`}
            disableRipple
            onClick={() => setManageSection(label)}
          >
            <h6 className="text-xs pb-1">{label}</h6>
          </Button>
        ))}
      </ButtonGroup>
      <div className="bg-cod-gray rounded-b-xl min-w-[23rem]">
        {manageSection === 'Trade' ? <TradeCard /> : <Manage />}
      </div>
    </div>
  );
};

const Inu = ({ poolName }: { poolName: string }) => {
  const { chainId, setSelectedPoolName } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName)
      setSelectedPoolName(poolName.toUpperCase());
  }, [poolName, setSelectedPoolName]);

  return (
    <>
      <div className="bg-black flex w-screen items-center justify-center">
        <PageLayout>
          <div className="w-full h-full flex flex-col space-y-2 xl:flex-row xl:space-x-5">
            <div className="flex flex-col w-full space-y-4 h-full"></div>
            <div>
              <ManageComponent />
            </div>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

const ManagePage = () => {
  const router = useRouter();
  const poolName = router.query['poolName'] as string;

  return (
    <>
      <NextSeo
        title={seo.scalps.title}
        description={seo.scalps.description}
        canonical={seo.scalps.url}
        openGraph={{
          url: seo.scalps.url,
          title: seo.scalps.title,
          description: seo.scalps.description,
          images: [
            {
              url: seo.scalps.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.scalps.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <Inu poolName={poolName} />
    </>
  );
};

export default ManagePage;

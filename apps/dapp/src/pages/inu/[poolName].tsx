import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import PageLayout from 'components/common/PageLayout';
import Stats from 'components/inu/Stats';
import TopBar from 'components/inu/TopBar';

import { CHAINS } from 'constants/chains';
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
      <div className="bg-cod-gray rounded-b-xl min-w-[23rem]"></div>
    </div>
  );
};

const Inu = ({ poolName }: { poolName: string }) => {
  const { chainId, setSelectedPoolName, selectedPoolName } = useBoundStore();

  useEffect(() => {
    if (poolName && setSelectedPoolName)
      setSelectedPoolName(poolName.toUpperCase());
  }, [poolName, setSelectedPoolName]);
  return (
    <>
      <div className="bg-black flex w-screen items-center justify-center">
        <PageLayout>
          <div className="mt-8 sm:mt-14 md:mt-20 lg:mr-full">
            <TopBar />
          </div>

          <div className="mt-6">
            <Stats />
          </div>

          <div className="flex justify-center w-full mt-10">
            <h5 className="text-silver">Contract Address:</h5>
            <p className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text ml-1">
              <a href={``} rel="noopener noreferrer" target={'_blank'}>
                0x.................................34
              </a>
            </p>
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
        title={seo.inu.title}
        description={seo.inu.description}
        canonical={seo.inu.url}
        openGraph={{
          url: seo.inu.url,
          title: seo.inu.title,
          description: seo.inu.description,
          images: [
            {
              url: seo.inu.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.inu.alt,
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

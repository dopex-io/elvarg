import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Switch } from '@dopex-io/ui';
import cx from 'classnames';
import { NextSeo } from 'next-seo';

import { useBoundStore } from 'store';

import PageLayout from 'components/common/PageLayout';
import DepositPanel from 'components/inu/DepositPanel';
import Stats from 'components/inu/Stats';
import TopBar from 'components/inu/TopBar';

import { CHAINS } from 'constants/chains';
import seo from 'constants/seo';

import Typography from '../../components/UI/Typography';

const ManageComponent = () => {
  const [manageSection, setManageSection] = useState<string>('Purchase');
  const [isInuSelected, setIsInuSelected] = useState<boolean>(false);

  const toggleIsInuSelected = () => {
    setIsInuSelected(!isInuSelected);
  };

  return (
    <div className="w-full h-fit-content bg-cod-gray border border-umbra p-1 px-3 rounded-xl">
      <div className="flex mt-3 mb-3">
        <h6 className="text-xs mr-3">Puts</h6>
        <Switch checked={isInuSelected} onChange={toggleIsInuSelected} />
        <h6 className="text-xs ml-3">Inu</h6>
      </div>

      <ButtonGroup className="flex w-full justify-between border border-umbra rounded-top-lg my-2">
        {['Purchase', 'Redeem'].map((label, index) => (
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
      <div className="bg-cod-gray rounded-xl min-w-[23rem]">
        <DepositPanel />
      </div>
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

          <div className="mt-6 flex">
            <div className="mr-4">
              <Stats />
            </div>
            <ManageComponent />
          </div>

          <div className="flex justify-center w-full mt-10">
            <h5 className="text-silver">Contract Address:</h5>
            <p className="bg-gradient-to-r from-wave-blue to-primary text-transparent bg-clip-text ml-1">
              <a href={``} rel="noopener noreferrer" target={'_blank'}>
                0x96FAEeE355195b3D4ad106127d448B4dF21af759
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

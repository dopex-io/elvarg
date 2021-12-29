import { useState } from 'react';
import Box from '@material-ui/core/Box';
import cx from 'classnames';
import Image from 'next/image';

import Typography from 'components/UI/Typography';

interface ShowcaseCardProps {
  nft: any;
  className?: string;
}

const ShowcaseCard = ({ nft, className }: ShowcaseCardProps) => {
  return (
    <>
      <Box className={cx('flex flex-col mb-4', className)}>
        <Box className="flex flex-col items-center" component="a">
          <a
            className="mb-6 text-xl"
            href={nft.uri}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              className="text-center hover:text-stieglitz"
              variant="h3"
            >
              {nft.name}
            </Typography>
          </a>
          <Box className="mb-6 items-center">
            {nft.horizontal ? (
              <Image
                src={nft.src}
                alt={nft.name}
                quality={100}
                height={250}
                width={350}
              />
            ) : (
              <Image
                src={nft.src}
                alt={nft.name}
                quality={100}
                height={350}
                width={250}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ShowcaseCard;

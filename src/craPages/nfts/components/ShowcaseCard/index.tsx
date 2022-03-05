import Box from '@mui/material/Box';
import cx from 'classnames';
import Image from 'next/image';

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
            <Box className="mb-6 items-center hover:opacity-100 opacity-75">
              {nft.horizontal ? (
                <Image src={nft.src} alt={nft.name} height={250} width={400} />
              ) : (
                <Image src={nft.src} alt={nft.name} height={350} width={250} />
              )}
            </Box>
          </a>
        </Box>
      </Box>
    </>
  );
};

export default ShowcaseCard;

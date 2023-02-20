import { useCallback, useEffect, useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@dopex-io/ui';

import DownloadIcon from '@mui/icons-material/Download';
import TwitterIcon from '@mui/icons-material/Twitter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { Typography } from 'components/UI';
import Dialog from 'components/UI/Dialog';

import ShareImage, { ShareImageProps } from './ShareImage';

import basicUpload from 'utils/general/basicUpload';
import getTwitterIntentURL from 'utils/general/getTwitterIntentURL';
import getShareURL from 'utils/general/getShareURL';

import { UPLOAD_ACCOUNT_ID, UPLOAD_API_KEY } from 'constants/env';

interface ShareDialogProps {
  open: boolean;
  handleClose: () => void;
  shareImageProps: ShareImageProps;
}

const ShareDialog = (props: ShareDialogProps) => {
  const { open, handleClose, shareImageProps } = props;

  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function uploadImage() {
      if (ref.current === null || !open) {
        return;
      }

      const image = await toBlob(ref.current, { cacheBust: true });

      if (UPLOAD_ACCOUNT_ID && UPLOAD_API_KEY) {
        setLoading(true);
        basicUpload({
          accountId: UPLOAD_ACCOUNT_ID,
          apiKey: UPLOAD_API_KEY,
          requestBody: image,
        }).then(
          (response) => {
            setImageURL(response.fileUrl);
            setLoading(false);
          },
          (error) => console.error(error)
        );
      }
    }

    uploadImage();
  }, [open]);

  const onDownload = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'dopex-share.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, [ref]);

  const onCopy = useCallback(() => {
    if (!imageURL) {
      return;
    }
    navigator.clipboard.writeText(imageURL);
  }, [imageURL]);

  return (
    <Dialog
      className="w-full"
      open={open}
      width={600}
      showCloseIcon
      handleClose={handleClose}
    >
      <div className="p-2">
        <Typography variant="h5" className="text-white font-semibold mb-4">
          Share
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className="border-2 border-carbon">
              <ShareImage ref={ref} {...shareImageProps} />
            </div>
            <div className="flex space-x-4 mt-4">
              <Button color="carbon" onClick={onDownload}>
                <DownloadIcon /> Download
              </Button>
              <Button color="carbon" onClick={onCopy}>
                <ContentCopyIcon /> Copy
              </Button>
              <Button color="carbon">
                <a
                  href={getTwitterIntentURL(
                    'Latest trade on @dopex_io ',
                    getShareURL(imageURL)
                  )}
                >
                  <TwitterIcon /> Tweet
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ShareDialog;

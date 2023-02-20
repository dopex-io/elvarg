import { useCallback, useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Button } from '@dopex-io/ui';
import { toast } from 'react-hot-toast';

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

  const uploadImage = useCallback(async () => {
    if (ref.current === null) {
      return;
    }

    const image = await toBlob(ref.current, { cacheBust: true });

    if (UPLOAD_ACCOUNT_ID && UPLOAD_API_KEY) {
      setLoading(true);
      const response = await basicUpload({
        accountId: UPLOAD_ACCOUNT_ID,
        apiKey: UPLOAD_API_KEY,
        requestBody: image,
      });

      setImageURL(response.fileUrl);
      setLoading(false);
      return response.fileUrl;
    }
  }, []);

  const onTweet = useCallback(async () => {
    let _imageURL = imageURL;
    if (!_imageURL) {
      _imageURL = await uploadImage();
    }
    window.open(
      getTwitterIntentURL(
        'Latest trade on @dopex_io ',
        getShareURL(
          _imageURL,
          `https://app.dopex.io${shareImageProps.customPath || '/'}`
        )
      ),
      '_blank'
    );
  }, [imageURL, uploadImage, shareImageProps.customPath]);

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

  const onCopy = useCallback(async () => {
    let _imageURL = imageURL;

    if (!_imageURL) {
      _imageURL = await uploadImage();
    }
    navigator.clipboard.writeText(_imageURL);
    toast.success('Copied!!! ');
  }, [imageURL, uploadImage]);

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
        <>
          <div className="border-2 border-carbon">
            <ShareImage ref={ref} {...shareImageProps} />
          </div>
          {loading ? (
            <div className="text-white">Uploading image...</div>
          ) : null}
          <div className="flex space-x-4 mt-4">
            <Button color="carbon" onClick={onDownload}>
              <DownloadIcon /> Download
            </Button>
            <Button color="carbon" onClick={onCopy}>
              <ContentCopyIcon /> Copy
            </Button>
            <Button color="carbon" onClick={onTweet}>
              <TwitterIcon /> Tweet
            </Button>
          </div>
        </>
      </div>
    </Dialog>
  );
};

export default ShareDialog;

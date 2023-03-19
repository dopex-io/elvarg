import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ShareImageProps } from 'components/common/Share/ShareImage';

interface ShareState {
  isOpen: boolean;
  open: (shareImageProps: ShareImageProps) => void;
  close: (e: any, reason: string) => void;
  shareImageProps: ShareImageProps;
}

const defaultShareDialogProps: ShareImageProps = {
  title: '',
  percentage: 0,
  customPath: '/',
  stats: [],
};

const useShare = create<ShareState>()(
  devtools((set) => ({
    isOpen: false,
    open: (shareImageProps: ShareImageProps) =>
      set(() => ({
        isOpen: true,
        shareImageProps,
      })),
    close: (_e: any, _reason: any) =>
      set(() => ({
        isOpen: false,
      })),
    shareImageProps: defaultShareDialogProps,
  }))
);

export default useShare;

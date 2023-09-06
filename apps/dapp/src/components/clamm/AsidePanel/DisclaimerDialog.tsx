import { Button, Dialog } from '@dopex-io/ui';

import { CLAMM_DISCLAIMER_MESSAGE } from 'constants/index';

const DisclaimerDialog = (props: any) => {
  const { isOpen, handleClose, handleAgree } = props;

  return (
    <div className="mt-20 z-40">
      <Dialog
        title="CLAMM user agreement"
        isOpen={isOpen}
        handleClose={handleClose}
        showCloseIcon
      >
        <div>
          <div className="p-3">
            <p className="text-stieglitz">
              By using the Dopex CLAMM Beta product, I agree to the following
              terms and conditions:
            </p>
          </div>
          <div className="p-3 bg-umbra rounded-lg">
            {CLAMM_DISCLAIMER_MESSAGE['english']
              .split('\n')
              .map((message, index) => (
                <p className="py-2 px-1 text-white text-sm" key={index}>
                  &#x2022; {message}
                </p>
              ))}
            <div className="pt-4 pb-1 w-full flex items-center justify-center">
              <Button onClick={handleAgree} className="w-full px-5">
                I agree
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DisclaimerDialog;

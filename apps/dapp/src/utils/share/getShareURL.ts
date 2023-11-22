const getShareURL = (imageID: string, redirectTo: string) => {
  if (typeof window !== 'undefined') {
    return `https://share.dopex.io/?imageID=${imageID}&redirectTo=${encodeURIComponent(
      `https://${window.location.hostname}${redirectTo}`
    )}`;
  }
  return '';
};

export default getShareURL;

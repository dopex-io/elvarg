const getShareURL = (imageID: string, redirectTo: string) => {
  if (typeof window !== 'undefined') {
    return `https://${
      window.location.hostname
    }/share?imageID=${imageID}&redirectTo=${encodeURIComponent(redirectTo)}`;
  }
  return '';
};

export default getShareURL;

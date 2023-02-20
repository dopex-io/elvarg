const getShareURL = (imageUrl: string) => {
  if (typeof window !== 'undefined') {
    return `https://${
      window.location.hostname
    }/share?imageUrl=${encodeURIComponent(imageUrl)}`;
  }
  return;
};

export default getShareURL;

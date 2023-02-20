const getShareURL = (imageUrl: string, redirectTo: string) => {
  if (typeof window !== 'undefined') {
    return `https://${
      window.location.hostname
    }/share?imageUrl=${encodeURIComponent(
      imageUrl
    )}&redirectTo=${encodeURIComponent(redirectTo)}`;
  }
  return;
};

export default getShareURL;

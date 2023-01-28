import { useWindowSize } from 'react-use';

const useScreenType = (): 'large' | 'medium' | 'small' => {
  const { width } = useWindowSize();

  if (width > 1024) return 'large';
  else if (width > 640) return 'medium';
  return 'small';
};

export default useScreenType;

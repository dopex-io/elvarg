import MuiSkeleton, { SkeletonProps } from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

const StyledSkeleton = styled(MuiSkeleton)`
  background-color: rgba(1, 1, 1, 0.3);
`;

const Skeleton = (props: SkeletonProps) => {
  return <StyledSkeleton {...props} />;
};

export default Skeleton;

import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import { Group } from '@visx/group';

const BrushHandle = ({ x, height, isBrushActive }: BrushHandleRenderProps) => {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#22E1FF"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        strokeWidth="1"
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
};

export default BrushHandle;

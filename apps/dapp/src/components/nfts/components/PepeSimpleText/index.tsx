import { ReactNode } from 'react';
import Typography from 'components/UI/Typography';

const PepeSimpleText = ({
  content,
  variant = 'h5',
}: {
  content: ReactNode;
  variant: 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) => {
  return (
    <Typography variant={variant} className={"font-['Minecraft']"}>
      {content}
    </Typography>
  );
};

export default PepeSimpleText;

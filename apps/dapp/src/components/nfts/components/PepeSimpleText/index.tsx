import Typography from 'components/UI/Typography';

const PepeSimpleText = ({
  text,
  variant = 'h5',
}: {
  text: string;
  variant: 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) => {
  return (
    <Typography variant={variant} className={"font-['Minecraft']"}>
      {text}
    </Typography>
  );
};

export default PepeSimpleText;

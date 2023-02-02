import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';

const PepeLink = ({
  link,
  text,
  className = '',
  variant = 'caption',
}: {
  link: string;
  text: string;
  className: string;
  variant: 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) => {
  const StyledText = styled(Typography)`
    background: linear-gradient(to right, #ffffff 0%, #9cecfd 64.06%);
    background-image: linear-gradient(to right, #ffffff 0%, #9cecfd 64.06%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  `;

  return (
    <Link href={link} target="_blank" className={className}>
      <StyledText
        variant={variant}
        className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
      >
        {text}
      </StyledText>
    </Link>
  );
};

export default PepeLink;

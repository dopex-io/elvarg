import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';

const PepeLink = ({
  link,
  text,
  className = '',
}: {
  link: string;
  text: string;
  className: string;
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
        variant="caption"
        className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
      >
        {text}
      </StyledText>
    </Link>
  );
};

export default PepeLink;

import Typography2 from 'components/UI/Typography2';

interface Props {
  imgSrc: string | [string, string];
  title: string;
  subtitle: string;
}

const Title = (props: Props) => {
  const { imgSrc, title, subtitle } = props;

  return (
    <div className="flex space-x-2">
      {typeof imgSrc === 'string' ? (
        <img src={imgSrc} alt="unknown" width={24} height={24} />
      ) : (
        <div className="relative w-8 h-8">
          <img
            src={imgSrc[0]}
            alt="unknown"
            width={20}
            height={20}
            className="absolute z-10 top-1 left-1"
          />
          <img
            src={imgSrc[1]}
            alt="unknown"
            width={20}
            height={20}
            className="absolute top-3 left-3"
          />
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <Typography2 variant="body2">{title}</Typography2>
        <Typography2 variant="caption" color="stieglitz" weight="400">
          {subtitle}
        </Typography2>
      </div>
    </div>
  );
};

export default Title;

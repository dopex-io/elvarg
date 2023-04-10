import PerpetualPoolsIcon from 'svgs/icons/PerpetualPoolsIcon';

interface Props {
  title: string;
  subtitle: string;
}

const Title = (props: Props) => {
  const { title, subtitle } = props;

  return (
    <div className="flex rounded-xl p-3 w-1/3 bg-cod-gray space-x-3">
      <PerpetualPoolsIcon className="my-auto" />
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-sm text-stieglitz">{subtitle}</p>
      </div>
    </div>
  );
};

export default Title;

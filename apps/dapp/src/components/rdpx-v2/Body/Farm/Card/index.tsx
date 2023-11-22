import Body from 'components/rdpx-v2/Body/Farm/Card/Body';
import ContractLink from 'components/rdpx-v2/Body/Farm/Card/ContractLink';
import Stats from 'components/rdpx-v2/Body/Farm/Card/Stats';
import Title from 'components/rdpx-v2/Body/Farm/Card/Title';

interface Props {
  title: string;
  subtitle: string;
  url: string;
  imgSrc?: string | [string, string];
  disable?: boolean;
}

const mock_stats = [
  {
    label: 'APR',
    value: '--',
    unit: null,
  },
  {
    label: 'TVL',
    value: '--',
    unit: null,
  },
];

const Card = (props: Props) => {
  const { title, subtitle, imgSrc = '', url, disable } = props;

  return (
    <div className="bg-cod-gray rounded-lg p-2 w-1/2 max-w-[390px] space-y-2">
      <Title
        imgSrc={imgSrc}
        title={title}
        subtitle={subtitle}
        disable={disable}
      />
      <Stats stats={mock_stats} />
      <Body />
      <ContractLink url={url} />
    </div>
  );
};

export default Card;

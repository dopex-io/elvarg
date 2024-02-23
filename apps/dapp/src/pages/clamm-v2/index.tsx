import PageLayout from 'components/common/PageLayout';



import LPPositions from '../../components/clamm/PositionsTable/components/Positions/LPPositions';
import Stats from './components/stats';


const Page = () => {
  return (
    <PageLayout>
      <LPPositions />
      {/* <Stats /> */}
    </PageLayout>
  );
};
export default Page;
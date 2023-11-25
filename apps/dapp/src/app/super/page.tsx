import AllPanel from './components/AllPanel';
// import NavigationMenu from './components/NavigationMenu';
import PortfolioValue from './components/PortfolioValue';
import Profile from './components/Profile';

const NAVIGATION_ROW_ITEMS = ['all', 'legacy', 'tokens'];

export default function Page() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <Profile />
        <PortfolioValue />
      </div>
      <div className="flex space-x-8 mb-8">
        {/* <NavigationMenu /> */}
        {NAVIGATION_ROW_ITEMS.map((item) => {
          return (
            <p
              key={item}
              className="hover:opacity-50 cursor-pointer capitalize"
            >
              {item}
            </p>
          );
        })}
      </div>
      <AllPanel />
    </div>
  );
}

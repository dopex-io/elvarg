// import { useState, useMemo, useContext } from 'react';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Checkbox from '@mui/material/Checkbox';
// import Input from '@mui/material/Input';

// import Typography from 'components/UI/Typography';

// import { AtlanticsContext } from 'contexts/Atlantics';

const StrategyFilter = () => {
  // const { marketsData } = useContext(AtlanticsContext);
  // const [selectedStrategies, setSelectedStrategies] = useState([]);
  // // console.log(selectedStrategies, setSelectedStrategies);
  // const strategies = useMemo(() => {
  //   return marketsData.map((market: any, index: number) => {
  //     return (
  //       <MenuItem value={market.tokenId} key={index} className="text-white">
  //         <Checkbox checked={false} className="text-white" />
  //         <Typography variant="h6">{market.strategy}</Typography>
  //       </MenuItem>
  //     );
  //   });
  // }, [marketsData]);
  // return (
  //   <Select
  //     label="Strategy"
  //     onChange={() => {}}
  //     className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white h-[2rem] mt-4"
  //     MenuProps={{
  //       classes: { paper: 'bg-mineshaft' },
  //     }}
  //     multiple
  //     value={marketsData}
  //     displayEmpty
  //     disableUnderline
  //     variant="outlined"
  //     input={<Input />}
  //     renderValue={() => {
  //       return (
  //         <Typography
  //           variant="h6"
  //           className="text-white text-center w-full relative"
  //         >
  //           Strategy
  //         </Typography>
  //       );
  //     }}
  //     classes={{
  //       icon: 'absolute text-white',
  //       select: 'overflow-hidden border-red',
  //     }}
  //   >
  //     {strategies}
  //   </Select>
  // );
};

export default StrategyFilter;

import React, { useEffect, useState } from 'react';

import TVChart from 'components/common/TVChart';

const PriceChart = () => {
  return (
    <div className="w-full lg:h-[500px] h-[300px] flex flex-col rounded-lg py-1 bg-cod-gray ">
      <TVChart />
    </div>
  );
};

export default PriceChart;

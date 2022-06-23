import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  info: {
    Icon?: React.FC;
    heading: string;
    value: string | undefined;
  }[];
  className: string;
}

const InfoBox = (props: InfoBoxProps) => {
  const { info, className } = props;

  return (
    <Box className={className}>
      {info.map((item, index) => {
        let borderRounding: { [key: number]: string } = {
          0: 'tl',
          1: 'tr',
          [info.length - 2]: 'bl',
          [info.length - 1]: 'br',
        };

        return (
          <Box
            key={index}
            className={`flex flex-col space-y-4 py-4 border border-umbra rounded-${borderRounding[index]}-xl justify-center h-full w-full p-3`}
          >
            <Typography variant="h5" color="stieglitz">
              {item.heading}
            </Typography>
            <Box className="flex space-x-2">
              <Typography variant="h5">{item.value}</Typography>
              <Box className="mb-2 overflow-auto">
                {item.Icon ? <item.Icon /> : null}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default InfoBox;

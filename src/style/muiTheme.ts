import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Ilisarniq',
  },
  palette: {
    primary: {
      main: '#002EFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          paddingTop: '10px',
          paddingBottom: '13px',
        },
        contained: {
          boxShadow: 'none',
        },
        root: {
          '&:focus': { outline: 'none' },
          borderRadius: '5px',
          paddingTop: '10px',
          paddingBottom: '13px',
          fontSize: '14px',
          lineHeight: '1',
          textTransform: 'none',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          '&$active': {
            '&& $icon': {
              color: 'white',
            },
          },
        },
      },
    },
  },
});

export default theme;

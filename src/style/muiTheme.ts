import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Ilisarniq',
  },
  palette: {
    primary: {
      main: '#002EFF',
    },
  },
  overrides: {
    MuiButton: {
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
      },
      label: {
        fontSize: '14px',
        lineHeight: '1',
        textTransform: 'none',
      },
    },
    MuiTableSortLabel: {
      root: {
        '&$active': {
          '&& $icon': {
            color: 'white',
          },
        },
      },
    },
  },
});

export default theme;

import ReactDOM from 'react-dom';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';

import App from './App';

import theme from './style/muiTheme';
import './style/index.css';

ReactDOM.render(
  <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById('root')
);

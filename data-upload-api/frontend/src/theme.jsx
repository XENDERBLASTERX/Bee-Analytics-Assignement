import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeightBold: 600,
  },
});

export default theme;

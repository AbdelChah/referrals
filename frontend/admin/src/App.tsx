import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import HeaderWrapper from "./components/HeaderWrapper";
import SideMenuWrapper from "./components/SideMenuWrapper";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import FooterWrapper from "./components/FooterWrapper";
import { defaultTheme, bobTheme, weepayTheme } from './theme/theme';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationInterceptor from "./services/authenticationInterceptor";

function App() {
  const themeVariable = import.meta.env.VITE_THEME
  const theme =
  themeVariable === 'bob'
    ? bobTheme
    : themeVariable === 'weepay'
    ? weepayTheme
    : defaultTheme;

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <ToastContainer />
      <Router
        future={{
          v7_relativeSplatPath: true,
        }}
      >
        <AuthenticationProvider>
        <AuthenticationInterceptor /> 
          {/* Layout container */}
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <SideMenuWrapper />
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                // paddingLeft: { xs: 0, sm: 250 }, // Adjust padding for side menu space
              }}
            >
              <HeaderWrapper />
              <AppRoutes />
            </Box>
          </Box>
          <FooterWrapper/>
        </AuthenticationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

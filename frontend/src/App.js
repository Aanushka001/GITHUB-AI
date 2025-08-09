import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/layout/Header';
// import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RepositoryPage from './pages/RepositoryPage';
import TestGenerationPage from './pages/TestGenerationPage';
import './App.css';
import Footer from './components/Footer';
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2ea043', 
    },
    secondary: {
      main: '#58a6ff', 
    },
    background: {
      default: '#0d1117', 
      paper: '#161b22',   
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 'bold' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/repository" element={<RepositoryPage />} />
              <Route path="/generate" element={<TestGenerationPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

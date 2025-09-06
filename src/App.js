import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import Navbar from './components/common/Navbar'; // Import your Navbar component
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatBotPage from './pages/ChatBotPage';
import AnalysisPage from './pages/AnalysisPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Create a wrapper component to access useLocation
function AppContent() {
  const location = useLocation();
  const isAnalysisPage = location.pathname === '/analysis';

  return (
    <div className="App">
      {isAnalysisPage ? (
        // Analysis page without Layout (no footer)
        <>
          <Navbar />
          <Routes>
            <Route path="/analysis" element={<AnalysisPage />} />
          </Routes>
        </>
      ) : (
        // Other pages with Layout (includes footer)
        <Layout>
          <Routes>
            {/* HOME ROUTE - Loads immediately on app start */}
            <Route index element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* APP ROUTES */}
            <Route path="/chat-bot" element={<ChatBotPage />} />
            
            {/* CATCH ALL - Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Layout from './components/layout/Layout';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import ChatBotPage from './pages/ChatBotPage';
// import AnalysisPage from './pages/AnalysisPage';
// import { AuthProvider } from './context/AuthContext';
// import { LanguageProvider } from './context/LanguageContext';
// import { ThemeProvider } from './context/ThemeContext';

// function App() {
//   return (
//     <ThemeProvider>
//       <LanguageProvider>
//         <AuthProvider>
//           <Router>
//             <div className="App">
//               <Layout>
//                 <Routes>
//                   <Route path="/" element={<HomePage />} />
//                   <Route path="/login" element={<LoginPage />} />
//                   <Route path="/signup" element={<SignupPage />} />
//                   <Route path="/chat-bot" element={<ChatBotPage />} />
//                   <Route path="/analysis" element={<AnalysisPage />} />
//                 </Routes>
//               </Layout>
//               <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="colored"
//               />
//             </div>
//           </Router>
//         </AuthProvider>
//       </LanguageProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatBotPage from './pages/ChatBotPage';
import AnalysisPage from './pages/AnalysisPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
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
                  <Route path="/analysis" element={<AnalysisPage />} />
                  
                  {/* CATCH ALL - Redirect unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
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
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

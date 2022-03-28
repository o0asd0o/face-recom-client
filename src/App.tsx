import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "pages/login/LoginPage";
// import RegisterPage from "pages/register/RegisterPage";
import { ToastContainer } from "react-toastify";
import PublicRoute from "components/PublicRoute";
import PrivateRoute from "components/PrivateRoute";

import 'react-toastify/dist/ReactToastify.css';
import Home from "pages/home/Home";
import RegisterPage from "pages/register/RegisterPage";
import Dashboard from "pages/home/dashboard/Dashboard";
import LandingPage from "pages/landing/LandingPage";
import Public from "pages/Public";
import BrowsePage from "pages/home/browse/BrowsePage";
import PreferencesPage from "pages/home/preferences/PreferencesPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/home" element={(
          <PrivateRoute>
            <Home /> 
          </PrivateRoute>
        )}>
            <Route index element={<Navigate to="/home/browse" />} />
            <Route path="/home/browse" element={<BrowsePage />} />
            <Route path="/home/preferences" element={<PreferencesPage />} />
            
        </Route>

        <Route path="/" element={(
          <PublicRoute>
            <Public />
          </PublicRoute>
        )}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Route>
        
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

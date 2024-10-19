import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Rskpi from './Rskpi';
import KpiGraphResto from './KpiGraphResto';

import Manage from './components/Manage';
import GroupTable from './components/GroupTable';
import GroupPermissions from './components/GroupPermissions';
import "react-calendar-timeline/lib/Timeline.css";
import '@syncfusion/ej2-base/styles/material.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  // Initialisation de l'état basé sur la présence d'un token dans localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Vérifier si un jeton est déjà stocké au premier rendu
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction pour gérer l'authentification (sera passée à LoginPage)
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Un composant pour protéger les routes
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };


  return (
    <Router>
     <div className="scale-down">
      <Routes>
        {/* Route de connexion */}
        <Route path="/" element={<LoginPage setIsAuthenticated={handleLogin} />} />

        {/* Routes protégées */}
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/Rskpi"
          element={
            <PrivateRoute>
              <Rskpi />
            </PrivateRoute>
          }
        />
        <Route

          path="/KpiGraphResto"
          element={
            <PrivateRoute>
              <KpiGraphResto />
            </PrivateRoute>
          }
        />


        <Route
          path="/manage"
          element={
            <PrivateRoute>
              <Manage />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <GroupTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:id/permissions"
          element={
            <PrivateRoute>
              <GroupPermissions />
            </PrivateRoute>
          }
        />

        {/* Redirection vers le dashboard si le chemin n'existe pas */}
//        <Route path="*" element={<Navigate to={isAuthenticated ? "/Dashboard" : "/"} />} />
      </Routes>
          </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <-- C'est cette ligne qui charge tout le design
import ReactGA from "react-ga4"; // 1. On importe le module

// 2. On initialise GA4 avec votre ID de mesure officiel
ReactGA.initialize("G-FVFKNP75BZ");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
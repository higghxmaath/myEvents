import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { EventProvider } from "./context/EventContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";   // <-- ADD THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>       
      <EventProvider>     
        <App />
      </EventProvider>
    </AuthProvider>
  </React.StrictMode>
);

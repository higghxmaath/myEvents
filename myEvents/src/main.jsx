import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App.jsx';

import { EventProvider } from "./context/EventContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EventProvider>
      <App />
    </EventProvider>
  </React.StrictMode>
);

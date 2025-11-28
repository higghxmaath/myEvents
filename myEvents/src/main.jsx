import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { EventProvider } from "./context/EventContext.jsx";
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <EventProvider>
    <App />
  </EventProvider>
);


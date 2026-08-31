import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/estado/AuthContext';
import { InteresProvider } from './shared/estado/InteresContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InteresProvider>
          <App />
        </InteresProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

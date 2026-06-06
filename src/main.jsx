import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TeacherProvider } from './context/TeacherContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TeacherProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 3000,
            style: {
              background: '#111127',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
            },
          }}
        />
      </TeacherProvider>
    </BrowserRouter>
  </StrictMode>
);

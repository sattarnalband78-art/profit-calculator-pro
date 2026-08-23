import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import { initNativeApp } from './utils/nativeBridge';

// Initialize native mobile integrations when running inside Capacitor Android
initNativeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


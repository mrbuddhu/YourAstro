import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx is being loaded');

const container = document.getElementById('root');
if (!container) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

console.log('Root element found:', container);

const root = createRoot(container);

console.log('About to render App component');

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

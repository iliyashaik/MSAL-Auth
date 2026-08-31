import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import createMSALInstance from './authConfig.ts';
import { AuthProvider } from './authProvider.tsx';

// Single shared instance — never recreated across renders
const pca = new PublicClientApplication(createMSALInstance());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider pca={pca}>
        <App pca={pca}/>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

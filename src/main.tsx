import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonStorageProvider } from './contexts/StorageContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <IonStorageProvider>
          <App />
        </IonStorageProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);



  // This application was developed by Onell Dishmey and Ramy Campusano
  // and is currently in the version 1.0.0
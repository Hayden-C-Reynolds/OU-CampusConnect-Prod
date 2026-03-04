import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonStorageProvider } from './contexts/StorageContext';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <IonStorageProvider>
      <App />
    </IonStorageProvider>
  </React.StrictMode>
);



                                    // This application was developed by Onell Dishmey and Ramy Campusano
                                    // and is currently in the version 1.0.0
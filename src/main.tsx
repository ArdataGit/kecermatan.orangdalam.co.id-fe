import React from 'react';
import ReactDOM from 'react-dom/client';
import merge from 'lodash/merge';

import { BrowserRouter } from 'react-router-dom';
import enConfig from 'tdesign-react/es/locale/en_US';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ConfigProvider } from 'tdesign-react';
import { Toaster } from 'react-hot-toast';

import RoutesList from './const/routes.tsx';

import './index.css';
import 'tdesign-react/es/style/index.css'; // global design variables

const globalConfig = merge(enConfig, {
  image: {
    errorText: 'Gagal Dimuat!',
    loadingText: 'Memuat...',
  },
});

// Get Google Client ID from environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ConfigProvider globalConfig={globalConfig}>
        <Toaster />
        <BrowserRouter>
          <RoutesList />
        </BrowserRouter>
      </ConfigProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

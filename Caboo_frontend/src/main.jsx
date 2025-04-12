import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const apiKey = import.meta.env.VITE_GOOGLE_OAUTH
ReactDOM.createRoot(document.getElementById('root')).render(

    <GoogleOAuthProvider clientId={apiKey}>
    <App />
    </GoogleOAuthProvider>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AlertProvider } from './contexts/AlertContext'

// Configuração Global do Axios
// Se VITE_API_URL estiver definido (no .env ou EasyPanel), usa ele.
// Se não, assume que o backend está na mesma origem (proxy) ou porta 8000 local para dev.
// Para EasyPanel production, VITE_API_URL deve ser definido
const apiUrl = import.meta.env.VITE_API_URL;


if (apiUrl) {
    axios.defaults.baseURL = apiUrl;
} else {
    // Fallback para desenvolvimento local
    if (window.location.hostname === 'localhost') {
        axios.defaults.baseURL = 'http://localhost:8000';
    }
}

// const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// console.log("GOOGLE ID DEBUG:", googleClientId);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <AlertProvider>
                    <App />
                </AlertProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)

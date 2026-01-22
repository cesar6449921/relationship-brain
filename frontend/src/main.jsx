import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// Configuração Global do Axios
// Se VITE_API_URL estiver definido (no .env ou EasyPanel), usa ele.
// Se não, assume que o backend está na mesma origem (proxy) ou porta 8000 local para dev.
// Para EasyPanel production, VITE_API_URL deve ser definido
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
    axios.defaults.baseURL = apiUrl;
} else {
    // Fallback para dev local ou produção via IP direto
    if (window.location.hostname === 'localhost') {
        axios.defaults.baseURL = 'http://localhost:8000';
    } else {
        // HARDCODED FALLBACK: Usa HTTP puro para evitar problema de Mixed Content
        // já que você está acessando o site via IP (http://35...)
        axios.defaults.baseURL = 'http://35.247.254.108:8000';
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)

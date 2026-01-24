import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const AlertContext = createContext();

export function useAlert() {
    return useContext(AlertContext);
}

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const showAlert = (type, title, message, duration = 5000) => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, type, title, message }]);

        if (duration) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    // Helpers
    const success = (title, message) => showAlert('success', title, message);
    const error = (title, message) => showAlert('error', title, message);
    const warning = (title, message) => showAlert('warning', title, message);
    const info = (title, message) => showAlert('info', title, message);

    return (
        <AlertContext.Provider value={{ showAlert, removeAlert, success, error, warning, info }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        className={`
                            pointer-events-auto transform transition-all duration-300 ease-in-out animate-in slide-in-from-top-5 fade-in
                            flex items-start gap-3 p-4 rounded-xl shadow-xl border border-white/20 backdrop-blur-md
                            ${alert.type === 'success' ? 'bg-green-500/90 text-white' : ''}
                            ${alert.type === 'error' ? 'bg-red-500/90 text-white' : ''}
                            ${alert.type === 'warning' ? 'bg-amber-500/90 text-white' : ''}
                            ${alert.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
                        `}
                    >
                        <div className="shrink-0 pt-0.5">
                            {alert.type === 'success' && <CheckCircle className="h-5 w-5" />}
                            {alert.type === 'error' && <AlertOctagon className="h-5 w-5" />}
                            {alert.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
                            {alert.type === 'info' && <Info className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                            {alert.title && <h3 className="font-bold text-sm leading-tight mb-1">{alert.title}</h3>}
                            <p className="text-sm opacity-90 leading-relaxed">{alert.message}</p>
                        </div>
                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
}

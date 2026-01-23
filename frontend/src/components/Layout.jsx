import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 pl-64">
            <Sidebar />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Settings, LogOut, Heart } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { icon: Home, label: 'Início', path: '/dashboard' },
        { icon: Settings, label: 'Configurações', path: '/settings' },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="h-16 flex items-center px-6 border-b border-slate-200">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                    <Heart className="h-6 w-6 fill-current" />
                    <span>NósDois.ai</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                                ? 'bg-brand-50 text-brand-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    Sair
                </button>
            </div>
        </div>
    );
}

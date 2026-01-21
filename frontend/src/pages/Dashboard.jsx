import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Heart, Users, CheckCircle, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/couples', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
        } catch (err) {
            alert('Erro ao criar o grupo. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Grupo Criado com Sucesso! 🎉</h2>
                    <p className="text-slate-600">
                        A IA já criou o grupo no WhatsApp e adicionou vocês dois.
                        Verifiquem seus celulares e mandem um "Oi" para começar a jornada!
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-100 transition-colors"
                    >
                        Sair do Painel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                    <Heart className="h-6 w-6 fill-current" />
                    <span>Painel do Casal</span>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sair
                </button>
            </nav>

            <main className="max-w-2xl mx-auto p-6 mt-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Configurar Parceiro(a)</h1>
                            <p className="text-slate-500">Vamos conectar vocês no WhatsApp.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Parceiro(a)</label>
                            <input
                                {...register("partner_name", { required: true })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                placeholder="Como ele(a) gosta de ser chamado(a)?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp do Parceiro(a)</label>
                            <input
                                {...register("partner_phone", { required: true })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                placeholder="55 + DDD + Número (Ex: 5511999999999)"
                            />
                            <p className="text-xs text-slate-400 mt-2">Nós vamos criar um grupo seguro apenas para vocês três (Você, Parceiro e IA).</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" /> Criando Grupo...
                                </>
                            ) : (
                                'Conectar e Iniciar Terapia 🚀'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

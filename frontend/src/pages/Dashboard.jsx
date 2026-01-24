import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Heart, Users, CheckCircle, Loader2, LogOut, MessageCircle, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [existingCouple, setExistingCouple] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyInfo();
    }, []);

    const fetchMyInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await axios.get('/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(res.data.user);
            setExistingCouple(res.data.couple);
        } catch (err) {
            console.error("Failed to fetch user info", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const onSubmit = async (data) => {
        // Validação: Verifica se o usuário tem número de telefone cadastrado
        if (!userData?.phone_number || userData.phone_number.trim() === '') {
            alert(
                '⚠️ Número de WhatsApp não cadastrado!\n\n' +
                'Para criar um grupo, você precisa adicionar seu número de WhatsApp nas Configurações.\n\n' +
                'Vá em: Configurações → WhatsApp → Salvar'
            );
            navigate('/settings');
            return;
        }

        setCreateLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/couples', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
            fetchMyInfo(); // Refresh to get the new couple data
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Erro ao criar o grupo. Verifique os dados e tente novamente.';
            alert(errorMsg);
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
            </div>
        );
    }

    // --- VIEW: Grupo Criado com Sucesso (Feedback imediato) ---
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
                        onClick={() => setSuccess(false)}
                        className="w-full py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors"
                    >
                        Ir para o Painel
                    </button>
                </div>
            </div>
        );
    }

    // --- VIEW: Dashboard Principal (Se já tem casal) ---
    if (existingCouple) {
        return (
            <div className="min-h-screen bg-slate-50">
                <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                        <Heart className="h-6 w-6 fill-current" />
                        <span>NósDois.ai</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600 text-sm hidden sm:inline">Olá, {userData?.full_name?.split(' ')[0]}</span>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
                            <LogOut className="h-4 w-4" /> Sair
                        </button>
                    </div>
                </nav>

                <main className="max-w-4xl mx-auto p-6 mt-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-brand-50 p-6 border-b border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <HeartHandshake className="h-6 w-6 text-brand-600" />
                                    Jornada Ativa
                                </h1>
                                <p className="text-brand-700 mt-1">Vocês estão conectados e a IA está ativa no WhatsApp.</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card do Grupo */}
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Grupo no WhatsApp</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    O grupo é o espaço seguro onde a mágica acontece. A IA monitora e intervém quando solicitada.
                                </p>
                                <div className="text-xs bg-white p-3 rounded border border-slate-200 text-slate-500 font-mono break-all">
                                    ID: {existingCouple.group_jid || 'Carregando...'}
                                </div>
                            </div>

                            {/* Card do Parceiro */}
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Seu Parceiro(a)</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Nome</p>
                                        <p className="text-slate-800 font-medium">{existingCouple.partner_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">WhatsApp</p>
                                        <p className="text-slate-800 font-medium">{existingCouple.partner_phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-sm text-slate-500">
                            Precisa de ajuda? Digite <strong>/ajuda</strong> no grupo do WhatsApp.
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- VIEW: Formulário de Criação (Se não tem casal ainda) ---
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                    <Heart className="h-6 w-6 fill-current" />
                    <span>NósDois.ai</span>
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
                            <p className="text-slate-500">Falta pouco! Vamos conectar vocês no WhatsApp.</p>
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
                            disabled={createLoading}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {createLoading ? (
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

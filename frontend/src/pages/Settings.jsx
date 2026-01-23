import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Save, Loader2, User, Mail, Phone, Lock } from 'lucide-react';

export default function Settings() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = res.data.user;
            setValue('full_name', user.full_name);
            setValue('email', user.email);
            setValue('phone_number', user.phone_number);
        } catch (err) {
            console.error(err);
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            // Remove senha se estiver vazia para não tentar atualizar
            if (!data.password) delete data.password;

            await axios.put('/api/me', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao atualizar dados. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Configurações da Conta</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register("full_name", { required: true })}
                                    className="pl-10 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="pl-10 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register("phone_number", { required: true })}
                                    className="pl-10 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Nova Senha (Opcional) */}
                        <div className="pt-4 border-t border-slate-100 mt-2">
                            <h3 className="text-sm font-medium text-slate-900 mb-4">Alterar Senha (Opcional)</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Deixe em branco para manter a atual"
                                        {...register("password", { minLength: 6 })}
                                        className="pl-10 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </form>
        </div>

            {/* Zona de Perigo */ }
    <div className="mt-8 bg-red-50 rounded-2xl shadow-sm border border-red-100 p-8">
        <h3 className="text-lg font-bold text-red-800 mb-2">Zona de Perigo</h3>
        <p className="text-sm text-red-600 mb-6">
            Esta ação irá desconectar você do seu parceiro(a) e do grupo no WhatsApp. O histórico de conversas com a IA será perdido para sempre.
        </p>
        <div className="flex justify-end">
            <button
                onClick={async () => {
                    if (window.confirm("Tem certeza absoluta? Isso irá apagar o grupo e desconectar o parceiro.")) {
                        try {
                            setLoading(true);
                            const token = localStorage.getItem('token');
                            await axios.delete('/api/couples/me', {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            alert('Grupo desconectado com sucesso.');
                            window.location.href = '/dashboard'; // Recarrega para voltar ao estado inicial
                        } catch (err) {
                            alert('Erro ao excluir grupo: ' + (err.response?.data?.detail || err.message));
                        } finally {
                            setLoading(false);
                        }
                    }
                }}
                className="px-6 py-2.5 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200"
            >
                Desconectar Casal & Excluir Grupo
            </button>
        </div>
    </div>
        </div >
    );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const { register, handleSubmit, watch, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('request'); // 'request' | 'reset'
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const onRequestSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await axios.post('/api/auth/forgot-password', { email: data.email });
            // MVP HACK: Show token if returned (for debug)
            if (res.data.debug_token) {
                setMessage({ type: 'success', text: 'Token gerado! (Para teste, cole o token abaixo).' });
                console.log("DEBUG TOKEN:", res.data.debug_token);
                // Pre-fill for convenience
                setValue('token', res.data.debug_token);
            } else {
                setMessage({ type: 'success', text: 'Se o email existir, um link foi enviado.' });
            }
            setStep('reset');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Erro ao solicitar recuperação.' });
        } finally {
            setLoading(false);
        }
    };

    const onResetSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.post('/api/auth/reset-password', {
                token: data.token,
                new_password: data.new_password
            });
            alert('Senha alterada com sucesso! Faça login.');
            navigate('/login');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Erro ao redefinir senha.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold text-2xl">
                    <Heart className="h-8 w-8 fill-current" />
                    <span>NósAi</span>
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                    Recuperar Senha
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    {step === 'request' ? 'Informe seu email para receber o link.' : 'Defina sua nova senha.'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {step === 'request' ? (
                        <form className="space-y-6" onSubmit={handleSubmit(onRequestSubmit)}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    {...register("email", { required: true })}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Enviar Link'}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit(onResetSubmit)}>
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-slate-700">Token de Recuperação</label>
                                <input
                                    id="token"
                                    type="text"
                                    required
                                    {...register("token", { required: true })}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 font-mono text-xs"
                                    placeholder="Cole o token aqui"
                                />
                            </div>
                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-slate-700">Nova Senha</label>
                                <input
                                    id="new_password"
                                    type="password"
                                    required
                                    {...register("new_password", { required: true, minLength: 6 })}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Alterar Senha'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6">
                        <Link to="/login" className="flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-500">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

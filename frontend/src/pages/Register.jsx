import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Loader2 } from 'lucide-react';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            await axios.post('/api/auth/signup', data);
            // Login automático ou redirecionar para login
            navigate('/login?success=true');
        } catch (err) {
            setServerError(err.response?.data?.detail || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold text-2xl">
                    <Heart className="h-8 w-8 fill-current" />
                    <span>NósDois.ai</span>
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                    Crie sua conta gratuita
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                        Fazer login
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Nome Completo */}
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
                                Nome Completo
                            </label>
                            <div className="mt-1">
                                <input
                                    id="full_name"
                                    type="text"
                                    required
                                    {...register("full_name", { required: true })}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    {...register("email", { required: true })}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                        </div>

                        {/* Telefone */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">
                                Seu WhatsApp (com DDD)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone_number"
                                    type="tel"
                                    placeholder="Ex: 5511999999999"
                                    required
                                    {...register("phone_number", { required: true })}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Formato internacional: 55 + DDD + Número</p>
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    {...register("password", { required: true, minLength: 6 })}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                        </div>

                        {serverError && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                                {serverError}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Criar Conta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

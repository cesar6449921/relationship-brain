import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Loader2 } from 'lucide-react';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(''); // 'creating_account', 'logging_in', 'creating_group', 'done'
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        setStatus('creating_account');
        
        try {
            // 1. Criar Conta do Usuário
            await axios.post('/api/auth/signup', {
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                password: data.password
            });

            // 2. Fazer Login Automático para pegar o Token
            setStatus('logging_in');
            const formData = new FormData();
            formData.append('username', data.email);
            formData.append('password', data.password);
            
            const loginRes = await axios.post('/api/auth/token', formData);
            const token = loginRes.data.access_token;
            localStorage.setItem('token', token); // Salva token se necessário em contexto global depois

            // 3. Criar o Casal (e disparar criação do grupo no WhatsApp)
            setStatus('creating_group');
            // Configurar axios com o token recém-adquirido
            const authConfig = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('/api/couples', {
                partner_name: data.partner_name,
                partner_phone: data.partner_phone
            }, authConfig);

            setStatus('done');
            // Redireciona para o Dashboard (que deve existir) ou avisa sucesso
            navigate('/dashboard?new_couple=true');

        } catch (err) {
            console.error(err);
            let msg = 'Erro ao criar conta. Tente novamente.';
            if (err.response) {
                if (status === 'creating_account') msg = `Erro no cadastro: ${err.response.data.detail || msg}`;
                else if (status === 'logging_in') msg = `Conta criada, mas erro no login: ${err.response.data.detail || msg}`;
                else if (status === 'creating_group') msg = `Conta criada, mas erro ao criar grupo: ${err.response.data.detail || msg}`;
            }
            setServerError(msg);
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
                    Comece sua jornada a dois
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Crie sua conta e conecte-se com seu parceiro(a)
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="border-b border-slate-200 pb-4 mb-4">
                             <h3 className="text-lg font-medium text-slate-900 mb-4">Seus Dados</h3>
                            {/* Nome Completo */}
                            <div className="mb-4">
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
                            <div className="mb-4">
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
                            <div className="mb-4">
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
                        </div>

                        <div className="pt-2">
                             <h3 className="text-lg font-medium text-slate-900 mb-4">Dados do Parceiro(a)</h3>
                             <p className="text-xs text-brand-600 mb-4 bg-brand-50 p-2 rounded">
                                Vamos criar um grupo no WhatsApp com vocês dois e a IA automaticamente!
                             </p>
                             
                             {/* Nome Parceiro */}
                            <div className="mb-4">
                                <label htmlFor="partner_name" className="block text-sm font-medium text-slate-700">
                                    Nome do Parceiro(a)
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="partner_name"
                                        type="text"
                                        required
                                        {...register("partner_name", { required: true })}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
                            </div>

                             {/* Telefone Parceiro */}
                             <div>
                                <label htmlFor="partner_phone" className="block text-sm font-medium text-slate-700">
                                    WhatsApp do Parceiro(a)
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="partner_phone"
                                        type="tel"
                                        placeholder="Ex: 5511888888888"
                                        required
                                        {...register("partner_phone", { required: true })}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
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
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>
                                            {status === 'creating_account' && 'Criando conta...'}
                                            {status === 'logging_in' && 'Autenticando...'}
                                            {status === 'creating_group' && 'Criando grupo no WhatsApp...'}
                                        </span>
                                    </div>
                                ) : 'Criar Conta & Iniciar Terapia'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

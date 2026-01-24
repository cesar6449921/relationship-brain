import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Loader2 } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, creating_account, logging_in, creating_group, done
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        setStatus('creating_account');

        console.log("🚀 Iniciando registro...");
        console.log("📡 API Base URL:", axios.defaults.baseURL);
        console.log("📦 Dados do formulário:", data);

        try {
            // 1. Criar Conta do Usuário
            console.log("➡️ Enviando POST /api/auth/signup");
            await axios.post('/api/auth/signup', {
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                password: data.password
            });
            console.log("✅ Usuário criado!");

            // 2. Fazer Login Automático para pegar o Token
            setStatus('logging_in');
            const formData = new FormData();
            formData.append('username', data.email);
            formData.append('password', data.password);

            console.log("➡️ Enviando POST /api/auth/token");
            const loginRes = await axios.post('/api/auth/token', formData);
            const token = loginRes.data.access_token;
            console.log("✅ Login realizado! Token obtido.");
            localStorage.setItem('token', token); // Salva token se necessário em contexto global depois

            // 3. Criar o Casal (e disparar criação do grupo no WhatsApp)
            setStatus('creating_group');
            // Configurar axios com o token recém-adquirido
            const authConfig = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log("➡️ Enviando POST /api/couples");
            await axios.post('/api/couples', {
                partner_name: data.partner_name,
                partner_phone: data.partner_phone
            }, authConfig);
            console.log("✅ Casal e grupo criados!");

            setStatus('done');
            // Redireciona para o Dashboard (que deve existir) ou avisa sucesso
            navigate('/dashboard?new_couple=true');

        } catch (err) {
            console.error("❌ ERRO NO PROCESSO:", err);
            console.log("🌐 Detalhes do erro config:", err.config);

            let msg = 'Erro ao criar conta. Tente novamente.';
            if (err.response) {
                console.error("🔴 Status do Erro:", err.response.status);
                console.error("🔴 Dados do Erro:", err.response.data);

                if (status === 'creating_account') msg = `Erro no cadastro: ${err.response.data.detail || msg}`;
                else if (status === 'logging_in') msg = `Conta criada, mas erro no login: ${err.response.data.detail || msg}`;
                else if (status === 'creating_group') msg = `Conta criada, mas erro ao criar grupo: ${err.response.data.detail || msg}`;
            } else if (err.request) {
                console.error("🔴 Sem resposta do servidor. O backend pode estar offline ou bloqueado.");
                msg = "Erro de conexão com o servidor. Verifique sua internet ou tente mais tarde.";
            } else {
                console.error("🔴 Erro na configuração da requisição:", err.message);
                msg = `Erro interno: ${err.message}`;
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
                    <span>NósAi</span>
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
                                        {...register("phone_number", { required: true, minLength: 10 })}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="mb-4">
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

                            {/* WhatsApp Parceiro */}
                            <div className="mb-4">
                                <label htmlFor="partner_phone" className="block text-sm font-medium text-slate-700">
                                    WhatsApp do Parceiro(a)
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="partner_phone"
                                        type="tel"
                                        placeholder="Ex: 5511999999999"
                                        required
                                        {...register("partner_phone", { required: true, minLength: 10 })}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {serverError && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {serverError}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Processando...
                                    </>
                                ) : (
                                    'Criar Conta & Iniciar Terapia'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

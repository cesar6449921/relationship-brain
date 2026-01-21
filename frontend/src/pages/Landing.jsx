import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Shield, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-6 h-16 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-sm fixed w-full z-10">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                    <Heart className="h-6 w-6 fill-current" />
                    <span>NósDois.ai</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium text-sm">Entrar</Link>
                    <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors">
                        Cadastro Gratuito
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8 mt-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium border border-brand-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        Nova Tecnologia de IA Empática
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                        Fortaleça sua relação com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">terapia guiada por IA</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        O primeiro terapeuta de bolso que vive no WhatsApp do casal.
                        Mediação de conflitos, exercícios de conexão e suporte emocional 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-105">
                            Começar Agora <ArrowRight className="h-5 w-5" />
                        </Link>
                        <a href="#como-funciona" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-medium text-lg flex items-center justify-center transition-colors">
                            Como funciona?
                        </a>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-24">
                    <FeatureCard
                        icon={<MessageCircle className="h-8 w-8 text-blue-500" />}
                        title="Mediação em Tempo Real"
                        description="Discussões ficando acaloradas? A IA intervém suavemente para traduzir sentimentos e acalmar os ânimos."
                    />
                    <FeatureCard
                        icon={<Heart className="h-8 w-8 text-brand-500" />}
                        title="Exercícios de Conexão"
                        description="Recebam perguntas diárias e desafios divertidos para redescobrir a intimidade e o carinho."
                    />
                    <FeatureCard
                        icon={<Shield className="h-8 w-8 text-green-500" />}
                        title="Espaço Seguro"
                        description="Tudo acontece num grupo criptografado no WhatsApp. Privacidade total para vocês serem vulneráveis."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
                <p>© 2024 NósDois.ai - Feito com ❤️ para casais.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    )
}

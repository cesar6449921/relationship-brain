import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, MessageCircle, Shield, ArrowRight, Check,
    Menu, X, ChevronDown, Star, Zap, Lock
} from 'lucide-react';
import HowItWorksAccordion from '../components/HowItWorksAccordion';

export default function Landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transaction-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <Heart className="h-7 w-7 text-brand-600 fill-current" />
                            <span className="font-display font-bold text-2xl tracking-tight">
                                <span className="text-brand-600">Nós</span>
                                <span className="text-brand-900">Ai</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Como Funciona</a>
                            <a href="#beneficios" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Benefícios</a>
                            <a href="#precos" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Planos</a>
                            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Dúvidas</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-4 py-2 transition-colors">
                                Entrar
                            </Link>
                            <Link to="/register" className="group text-sm font-semibold bg-brand-600 text-white px-5 py-2.5 rounded-full hover:bg-brand-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                Teste Grátis
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 hover:text-brand-600">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full px-4 py-4 flex flex-col gap-4 shadow-xl">
                        <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600">Como Funciona</a>
                        <a href="#beneficios" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600">Benefícios</a>
                        <a href="#precos" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600">Planos</a>
                        <hr className="border-slate-100" />
                        <Link to="/login" className="text-center font-semibold text-slate-700 py-2">Entrar</Link>
                        <Link to="/register" className="bg-brand-600 text-white text-center font-bold py-3 rounded-xl shadow-md">Começar Teste Grátis</Link>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">

                    {/* Hero Content */}
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-semibold mx-auto lg:mx-0 w-fit">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                            </span>
                            Nova IA de Mediação v2.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                            Sua relação mais forte com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Terapia Guiada por IA</span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            O primeiro terapeuta de bolso que vive no <strong>WhatsApp</strong> do casal.
                            Mediação de conflitos em tempo real, exercícios de conexão e privacidade total.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-700 hover:scale-[1.02] transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2">
                                Testar Grátis Agora
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>Criptografado & Seguro</span>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-center lg:justify-start gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-2 text-slate-700 font-medium">4.9/5 por 1.200+ casais</span>
                        </div>
                    </div>

                    {/* Hero Visual (CSS Mockup) */}
                    <div className="relative mx-auto lg:mr-0 max-w-sm w-full">
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative z-10 w-full aspect-[9/18]">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>

                            {/* WhatsApp Header Mock */}
                            <div className="bg-[#075E54] -mx-4 -mt-4 p-4 pt-8 text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white fill-current" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">NósAi & Casal</h3>
                                    <p className="text-[10px] opacity-80">Online agora</p>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex flex-col gap-4 mt-4 h-full pb-20 text-xs sm:text-sm">
                                {/* Message 1: User A */}
                                <div className="self-end bg-[#E7FFDB] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                                    <p className="text-slate-800">Você nunca me escuta quando eu falo do meu trabalho! 😡</p>
                                    <span className="text-[10px] text-slate-400 flex justify-end mt-1">19:42 vv</span>
                                </div>

                                {/* Message 2: User B */}
                                <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-slate-100">
                                    <p className="text-slate-800">Eu escuto sim, mas você só reclama o tempo todo.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">19:43</span>
                                </div>

                                {/* Message 3: AI Intervention */}
                                <div className="self-center my-4 bg-slate-100 px-3 py-1 rounded-full text-[10px] text-slate-500 font-medium">
                                    NósAi está digitando...
                                </div>

                                <div className="self-start bg-gradient-to-br from-brand-50 to-white p-4 rounded-xl shadow-md border border-brand-100 w-full relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                                    <div className="flex items-center gap-2 mb-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                                        <Zap className="w-3 h-3" /> Mediação Ativa
                                    </div>
                                    <p className="text-slate-700 leading-relaxed mb-2">
                                        Pessoal, percebo que os ânimos exaltaram.
                                    </p>
                                    <p className="text-slate-700 leading-relaxed">
                                        <strong>@João</strong>, quando a <strong>@Maria</strong> fala sobre o trabalho, ela pode estar buscando <em>acolhimento</em>, não soluções. Que tal tentarmos ouvir sem julgar por 5 minutos? 🌱
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements behind phone */}
                        <div className="absolute top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-700 hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Conflito Evitado</p>
                                    <p className="text-xs text-slate-500">Há 2 min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF --- */}
            <section className="py-10 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
                        Tecnologia usada para fortalecer milhares de famílias
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake generic logos for "Tech/Press" appearance */}
                        {['OpenAI', 'WhatsApp Business', 'Google Cloud', 'Stripe Secure'].map((brand) => (
                            <span key={brand} className="text-xl font-bold text-slate-400 flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-200 rounded-md"></div> {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>



            {/* --- HOW IT WORKS (NOVA ANIMAÇÃO) --- */}
            <section id="como-funciona" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Como a mágica acontece?</h2>
                        <p className="text-lg text-slate-600">É tão simples quanto mandar um "Oi". Sem apps extras para baixar, tudo acontece onde vocês já conversam.</p>
                    </div>

                    {/* Componente Interativo Accordion */}
                    <HowItWorksAccordion />
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="beneficios" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                <Zap className="w-4 h-4" /> Funcionalidades Premium
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                Muito mais que um Chatbot.<br />
                                Um <span className="text-brand-600">Terapeuta Ativo</span>.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                A maioria dos apps de casal são passivos. O NósAi é <strong>ativo</strong>. Ele percebe o tom da conversa, identifica gatilhos emocionais e intervém antes que a briga escale.
                            </p>

                            <ul className="space-y-4">
                                <FeatureItem text="Intervenção em Tempo Real durante discussões" />
                                <FeatureItem text="Tradução de sentimentos (O que ele disse vs O que sentiu)" />
                                <FeatureItem text="Exercícios diários de gratidão e conexão" />
                                <FeatureItem text="Botão de Pânico para encerrar brigas na hora" />
                            </ul>

                            <Link to="/register" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:gap-3 transition-all">
                                Ver todas as funcionalidades <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <BentoItem title="Privacidade" desc="Criptografia E2E" color="bg-green-50" textColor="text-green-700" />
                            <BentoItem title="Disponível 24h" desc="Sempre lá por vocês" color="bg-blue-50" textColor="text-blue-700" />
                            <BentoItem title="IA Empática" desc="Não julga, acolhe" color="bg-purple-50" textColor="text-purple-700" className="col-span-2" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section id="precos" className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Investimento na sua Felicidade</h2>
                    <p className="text-slate-400 mb-12 max-w-xl mx-auto">Mais barato que um jantar. Infinitamente mais barato que um divórcio.</p>

                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">

                        {/* Tier 1: Monthly */}
                        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-slate-600 transition-colors flex-1 text-left">
                            <h3 className="text-xl font-bold text-white mb-2">Mensal</h3>
                            <p className="text-slate-400 text-sm mb-6">Flexibilidade total. Cancele quando quiser.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold">R$ 49,90</span>
                                <span className="text-slate-500">/mês</span>
                            </div>
                            <Link to="/register" className="w-full block text-center py-3 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors mb-6">
                                Começar Trial de 7 Dias
                            </Link>
                            <ul className="space-y-3">
                                <PricingCheck text="Acesso total à IA" />
                                <PricingCheck text="1 Grupo de Casal" />
                                <PricingCheck text="Suporte por Email" />
                            </ul>
                        </div>

                        {/* Tier 2: Annual (Popular) */}
                        <div className="bg-brand-600 p-8 rounded-3xl border border-brand-500 relative flex-1 text-left transform md:-translate-y-4 shadow-2xl shadow-brand-900/50">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wide">
                                Recomendado
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Anual</h3>
                            <p className="text-brand-100 text-sm mb-6">Economize R$ 120,00 por ano.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold">R$ 39,90</span>
                                <span className="text-brand-100">/mês</span>
                            </div>
                            <p className="text-xs text-brand-200 -mt-4 mb-4">Cobrado anualmente (R$ 478,80)</p>

                            <Link to="/register" className="w-full block text-center py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-slate-100 transition-colors mb-6 shadow-lg">
                                Começar Trial de 7 Dias
                            </Link>
                            <ul className="space-y-3">
                                <PricingCheck text="Tudo do plano Mensal" light />
                                <PricingCheck text="Prioridade nas filas" light />
                                <PricingCheck text="Relatório Mensal de Evolução" light />
                                <PricingCheck text="2 Meses Grátis" light />
                            </ul>
                        </div>

                    </div>

                    <p className="mt-8 text-sm text-slate-500">
                        * Garantia de 7 dias incondicional. Não gostou? Devolvemos seu dinheiro.
                    </p>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section id="faq" className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        <FaqItem q="A IA lê minhas mensagens privadas?" a="Não. A IA só tem acesso às mensagens enviadas no grupo específico do casal criado por nós. Suas conversas privadas individuais continuam 100% privadas." />
                        <FaqItem q="Substitui um terapeuta humano?" a="Não. O NósAi é uma ferramenta de suporte emocional e mediação de conflitos leves a moderados. Para casos graves, traumas ou transtornos, recomendamos terapia clínica profissional." />
                        <FaqItem q="Posso cancelar a qualquer momento?" a="Sim. Sem contratos de fidelidade para o plano mensal. Você cancela com um clique no painel." />
                        <FaqItem q="Funciona em qualquer celular?" a="Sim! Se você tem WhatsApp, você pode usar o NósAi. Não precisa instalar nenhum aplicativo extra." />
                    </div>
                </div>
            </section>

            {/* --- footer --- */}
            <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="h-6 w-6 text-brand-600 fill-current" />
                                <span className="font-display font-bold text-xl">
                                    <span className="text-brand-600">Nós</span>
                                    <span className="text-brand-900">Ai</span>
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs">
                                Inteligência Artificial a favor do amor. <br />
                                Reconectando casais, uma mensagem por vez.
                            </p>
                        </div>
                        <div className="flex gap-8 text-sm text-slate-600">
                            <Link to="/login" className="hover:text-brand-600">Login</Link>
                            <Link to="/terms" className="hover:text-brand-600">Termos de Uso</Link>
                            <Link to="/privacy" className="hover:text-brand-600">Privacidade</Link>
                            <a href="#" className="hover:text-brand-600">Contato</a>
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
                        &copy; {new Date().getFullYear()} NósAi Tecnologia LTDA. Todos os direitos reservados.
                    </div>
                </div>
            </footer>

        </div>
    );
}

// --- SUB COMPONENTS ---

function StepCard({ number, title, desc, icon }) {
    return (
        <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 z-10 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
                {icon}
            </div>
            <div className="absolute top-4 right-4 text-4xl font-black text-slate-100 -z-10 select-none">
                {number}
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function FeatureItem({ text }) {
    return (
        <li className="flex items-start gap-3">
            <div className="mt-1 min-w-[20px]">
                <Check className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-slate-700 font-medium">{text}</span>
        </li>
    )
}

function BentoItem({ title, desc, color, textColor, className = "" }) {
    return (
        <div className={`p-6 rounded-2xl ${color} ${className} flex flex-col justify-center`}>
            <h4 className={`font-bold text-lg ${textColor}`}>{title}</h4>
            <p className={`text-sm opacity-80 ${textColor}`}>{desc}</p>
        </div>
    )
}

function PricingCheck({ text, light = false }) {
    return (
        <li className="flex items-center gap-3 text-sm">
            <Check className={`w-4 h-4 ${light ? 'text-brand-200' : 'text-brand-600'}`} />
            <span className={light ? 'text-brand-50' : 'text-slate-600'}>{text}</span>
        </li>
    )
}

function FaqItem({ q, a }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="p-4 flex justify-between items-center font-semibold text-slate-800">
                {q}
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-200/50 pt-2">
                    {a}
                </div>
            )}
        </div>
    )
}

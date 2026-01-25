import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, MessageCircle, Shield, ArrowRight, Check,
    Menu, X, ChevronDown, Star, Zap, Lock
} from 'lucide-react';
import HowItWorksAccordion from '../components/HowItWorksAccordion';
import CoupleHeroAnimation from '../components/CoupleHeroAnimation';
import PhoneMockup from '../components/PhoneMockup';

export default function Landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transaction-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
                            {/* Logo SVG Customizado - Pin com Coração */}
                            <div className="relative w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                {/* Fundo Pin Magenta */}
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-600 drop-shadow-sm">
                                    <path
                                        d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
                                        fill="currentColor"
                                    />
                                    {/* Coração Vazado (Branco) */}
                                    <path
                                        d="M12 6.5C10.5 5 8.5 5 7.5 6C6.5 7 6.5 9 8 10.5L12 14.5L16 10.5C17.5 9 17.5 7 16.5 6C15.5 5 13.5 5 12 6.5Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">
                                <span className="text-brand-600">Nós</span>
                                <span className="text-ai">Ai</span>
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


                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                            Sua relação mais forte com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Mediação Guiada por IA</span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            O primeiro mediador de bolso que vive no <strong>WhatsApp</strong> do casal.
                            Mediação de conflitos em tempo real, exercícios de conexão e privacidade total.
                        </p>

                        {/* Disclaimer de Compliance */}
                        <p className="text-sm text-slate-500 max-w-xl mx-auto lg:mx-0 italic">
                            💡 Ferramenta de mediação e coaching de relacionamento. Não substitui aconselhamento profissional.
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

                    {/* Hero Visual (Animations) */}
                    <div className="relative mx-auto lg:mr-0 max-w-lg w-full">
                        <CoupleHeroAnimation />
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF --- */}
            <section className="py-10 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
                        Tecnologia de ponta para garantir um espaço seguro de diálogo
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {/* Google Gemini */}
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-lg hover:text-[#4285F4] transition-colors duration-300 cursor-default">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C11.5 6.5 8 10 3.5 10.5C8 11 11.5 14.5 12 19C12.5 14.5 16 11 20.5 10.5C16 10 12.5 6.5 12 2Z" />
                            </svg>
                            <span>Google Gemini AI</span>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-lg hover:text-[#25D366] transition-colors duration-300 cursor-default">
                            <div className="bg-current p-0.5 rounded-full">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <span>WhatsApp</span>
                        </div>

                        {/* Google Cloud */}
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-lg hover:text-[#DB4437] transition-colors duration-300 cursor-default">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                            <span>Google Cloud</span>
                        </div>

                        {/* Security */}
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-lg hover:text-brand-600 transition-colors duration-300 cursor-default">
                            <Shield className="w-6 h-6" />
                            <span>Criptografia SSL</span>
                        </div>
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
                    {/* Componente Interativo Accordion */}
                    <HowItWorksAccordion />

                    <div className="mt-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl overflow-hidden relative">
                        {/* Background Decorations */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                            {/* Left: Content */}
                            <div className="text-left">
                                <div className="inline-block bg-brand-100 p-3 rounded-2xl mb-6 shadow-sm">
                                    <MessageCircle className="w-8 h-8 text-brand-600" />
                                </div>
                                <h3 className="text-3xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                    Mediação em Tempo Real <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Direto no WhatsApp</span>
                                </h3>
                                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                                    Veja como o NósAi intervém de forma gentil e imparcial quando os ânimos se exaltam, sugerindo pausas e reformulando frases tóxicas.
                                </p>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Sem aplicativos extras para baixar',
                                        'Privacidade total via Criptografia',
                                        'Disponível 24/7 para o casal'
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3">
                                            <div className="bg-green-100 p-1 rounded-full">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/register" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 group">
                                    Experimentar Agora
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Right: Phone */}
                            <div className="flex justify-center transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
                                <PhoneMockup />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="beneficios" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/2 space-y-8">

                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                Muito mais que um Chatbot.<br />
                                Um <span className="text-brand-600">Mediador Ativo</span>.
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
                        <FaqItem
                            q="Substitui um profissional de saúde mental?"
                            a="Não. O NósAi é uma ferramenta de mediação e coaching de relacionamento para conflitos cotidianos leves a moderados. Não somos profissionais de saúde mental licenciados. Para casos graves, traumas, violência ou transtornos psicológicos, procure um psicólogo ou terapeuta profissional."
                        />
                        <FaqItem q="E se houver uma situação de emergência?" a="Se detectarmos palavras relacionadas a violência, abuso ou risco de vida, bloqueamos a mediação automática e fornecemos números de emergência (190, 180, CVV 188). Sua segurança é prioridade." />
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
                            <div className="flex items-center gap-2 mb-4 group">
                                {/* Logo SVG Customizado Footer */}
                                <div className="relative w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-600 drop-shadow-sm">
                                        <path
                                            d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M12 6.5C10.5 5 8.5 5 7.5 6C6.5 7 6.5 9 8 10.5L12 14.5L16 10.5C17.5 9 17.5 7 16.5 6C15.5 5 13.5 5 12 6.5Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                <span className="font-display font-bold text-xl">
                                    <span className="text-brand-600">Nós</span>
                                    <span className="text-ai">Ai</span>
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
                    <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200 space-y-2">
                        <p>&copy; {new Date().getFullYear()} NósAi Tecnologia LTDA. Todos os direitos reservados.</p>
                        <p className="text-slate-500 max-w-3xl mx-auto leading-relaxed">
                            <strong>Aviso Legal:</strong> NósAi é uma ferramenta de mediação e coaching de relacionamento baseada em IA.
                            Não somos profissionais de saúde mental licenciados e não oferecemos diagnósticos clínicos ou tratamento médico.
                            Para situações graves, procure um psicólogo, terapeuta ou profissional de saúde mental qualificado.
                        </p>
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

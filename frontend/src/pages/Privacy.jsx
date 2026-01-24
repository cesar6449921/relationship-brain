import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Simples */}
            <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold text-xl">
                    <span>NósAi</span>
                </Link>
                <Link to="/" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" /> Voltar
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto p-6 md:p-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Política de Privacidade</h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                        <p className="text-lg">
                            Sua privacidade é fundamental para o <strong>NósAi</strong>. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso assistente de terapia de casal via WhatsApp.
                        </p>

                        <div className="border-l-4 border-brand-500 pl-4 py-2 bg-brand-50 rounded-r-lg my-6">
                            <p className="font-medium text-brand-900 m-0">
                                <strong>Resumo:</strong> Seus dados são usados exclusivamente para fornecer o serviço de mediação. Não vendemos seus dados. As conversas são analisadas por IA, mas mantidas em sigilo.
                            </p>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                            <Database className="h-5 w-5 text-brand-600" />
                            1. Dados que Coletamos
                        </h3>
                        <p>Para o funcionamento do serviço, coletamos:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Identificação:</strong> Nome, e-mail e número de WhatsApp.</li>
                            <li><strong>Mensagens:</strong> O histórico das conversas no grupo do WhatsApp criado pelo bot é processado para gerar as mediações.</li>
                            <li><strong>Metadados:</strong> Horários de mensagens e interações para análise de conflitos.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                            <Eye className="h-5 w-5 text-brand-600" />
                            2. Como Usamos os Dados
                        </h3>
                        <p>Utilizamos suas informações para:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Fornecer mediação ativa em tempo real via WhatsApp.</li>
                            <li>Identificar padrões de conflito e sugerir resoluções.</li>
                            <li>Melhorar a precisão da IA (modelos de linguagem).</li>
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                            <Lock className="h-5 w-5 text-brand-600" />
                            3. Segurança e IA
                        </h3>
                        <p>
                            As mensagens são processadas por tecnologias de Inteligência Artificial (LLMs) via APIs seguras (como Google Gemini).
                            Embora utilizemos criptografia em trânsito e repouso, recomendamos não compartilhar em nossas conversas:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Senhas bancárias ou financeiras.</li>
                            <li>Dados de saúde sensíveis.</li>
                            <li>Informações sigilosas de terceiros.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 mt-8">4. Seus Direitos</h3>
                        <p>
                            Você pode, a qualquer momento, solicitar a exclusão de todos os seus dados e histórico de conversas através do painel de controle (Configurações > Zona de Perigo) ou enviando um comando <code>/reset</code> no chat.
                        </p>

                        <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-500">
                            Última atualização: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

import React from 'react';
import { ArrowLeft, Scale, AlertTriangle, MessageSquare, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <Scale className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Termos de Uso</h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                        <p className="text-lg">
                            Bem-vindo ao <strong>NósAi</strong>. Ao utilizar nosso serviço, você concorda com os termos descritos abaixo. Leia com atenção.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-6 flex gap-4">
                            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                            <div>
                                <h4 className="font-bold text-amber-800 mb-1">Aviso Importante: Saída da Responsabilidade</h4>
                                <p className="text-sm text-amber-700 m-0 leading-relaxed">
                                    O NósAi é uma ferramenta de IA para <strong>suporte e mediação de conflitos cotidianos</strong>.
                                    Ele <strong>NÃO SUBSTITUI</strong> terapia profissional, psicólogos ou aconselhamento médico.
                                    Para casos de violência doméstica, abuso ou crises graves, procure ajuda humana especializada e autoridades competentes.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                            <MessageSquare className="h-5 w-5 text-brand-600" />
                            1. O Serviço
                        </h3>
                        <p>
                            O NósAi oferece um "bot" mediador no WhatsApp que utiliza Inteligência Artificial para analisar conversas e intervir com sugestões e conselhos para casais. O serviço é fornecido "como está", sem garantias de resolução de todos os conflitos.
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                            <HeartHandshake className="h-5 w-5 text-brand-600" />
                            2. Conduta do Usuário
                        </h3>
                        <p>Ao usar o serviço, você concorda em:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Obter o consentimento explícito do seu parceiro(a) antes de adicioná-lo ao serviço.</li>
                            <li>Não utilizar a ferramenta para assédio, ameaças ou atividades ilegais.</li>
                            <li>Respeitar as sugestões da IA como conselhos, não ordens.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 mt-8">3. Limitação de Responsabilidade</h3>
                        <p>
                            A NósAi Tecnologia não se responsabiliza por decisões tomadas pelo casal com base nas sugestões da IA, nem por falhas técnicas na entrega de mensagens do WhatsApp, que depende da plataforma da Meta.
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 mt-8">4. Cancelamento</h3>
                        <p>
                            Você pode cancelar o serviço a qualquer momento, desconectando o bot e excluindo o grupo no WhatsApp.
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

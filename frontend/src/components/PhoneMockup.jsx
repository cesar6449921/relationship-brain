import React from 'react';
import { Heart, Check, Zap } from 'lucide-react';

const PhoneMockup = () => {
    return (
        <div className="relative mx-auto lg:mr-0 max-w-sm w-full">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative z-10 w-full aspect-[9/18]">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>

                {/* WhatsApp Header Mock */}
                <div className="bg-[#075E54] -mx-4 -mt-4 p-4 pt-8 text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        {/* Mini Logo no Header do Celular */}
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white drop-shadow-sm">
                            <path d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z" fill="currentColor" />
                            <path d="M12 6.5C10.5 5 8.5 5 7.5 6C6.5 7 6.5 9 8 10.5L12 14.5L16 10.5C17.5 9 17.5 7 16.5 6C15.5 5 13.5 5 12 6.5Z" fill="rgba(7, 94, 84, 1)" />
                        </svg>
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
    );
};

export default PhoneMockup;

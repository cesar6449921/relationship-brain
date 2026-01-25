import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, MessageCircle, Heart, ArrowRight } from "lucide-react";
import NetworkAnimation from "./NetworkAnimation";
import SecureAnimation from "./SecureAnimation";
import GrowthAnimation from "./GrowthAnimation";

// Dados dos passos
const steps = [
    {
        id: 1,
        title: "Cadastro Rápido",
        description: "Crie sua conta em segundos. Só precisamos do seu nome e telefone. Sem formulários chatos, tudo simplificado para você começar já.",
        icon: Lock,
        image: "https://images.unsplash.com/photo-1616077168712-fc6c788cad34?q=80&w=1000&auto=format&fit=crop",
        color: "bg-brand-50",
        Animation: SecureAnimation
    },
    {
        id: 2,
        title: "Conexão WhatsApp",
        description: "Nossa IA cria um grupo seguro e criptografado só para vocês três (Você, Parceiro e IA). Funciona direto no app que vocês já usam.",
        icon: MessageCircle,
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop",
        color: "bg-brand-100",
        Animation: NetworkAnimation
    },
    {
        id: 3,
        title: "Evolução Diária",
        description: "A IA media conflitos em tempo real, sugere melhorias na comunicação e envia exercícios personalizados baseados nas suas conversas.",
        icon: Heart,
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop",
        color: "bg-brand-200",
        Animation: GrowthAnimation
    },
];

export default function HowItWorksAccordion() {
    const [activeId, setActiveId] = useState(2); // Começa com o do meio aberto

    return (
        <div className="w-full max-w-6xl mx-auto h-[800px] md:h-[450px] flex flex-col md:flex-row gap-4 px-4 md:px-0">
            {steps.map((step) => {
                const isActive = activeId === step.id;

                return (
                    <motion.div
                        key={step.id}
                        onClick={() => setActiveId(step.id)}
                        onHoverStart={() => setActiveId(step.id)} // Hover para desktop
                        className={`
                            relative rounded-[2rem] overflow-hidden cursor-pointer 
                            transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end p-6 md:p-8 isolate
                            ${isActive
                                ? 'flex-[3] bg-[#2A0F2E] shadow-2xl shadow-brand-900/20 ring-1 ring-white/10'
                                : 'flex-1 bg-white border border-slate-200 hover:border-brand-200 hover:bg-brand-50/50 shadow-sm'
                            }
                        `}
                        layout
                    >
                        {/* Animação SVG Específica (Absoluta no fundo) */}
                        {isActive && step.Animation && (
                            <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20 pointer-events-none block">
                                <step.Animation />
                            </div>
                        )}

                        {/* Ícone e Número - Topo (Absoluto para manter posição durante a transição flex) */}
                        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex justify-between items-start z-20">
                            {/* Ícone */}
                            <div className={`
                                p-3 md:p-4 rounded-2xl transition-all duration-300
                                ${isActive
                                    ? 'bg-[#E62E81] text-white shadow-lg shadow-[#E62E81]/30 rotate-0'
                                    : 'bg-brand-50 text-[#E62E81] -rotate-12 group-hover:rotate-0'
                                }
                            `}>
                                <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
                            </div>

                            {/* Número do Passo */}
                            <span className={`
                                text-4xl md:text-6xl font-display font-black leading-none transition-colors duration-300
                                ${isActive ? 'text-white/10' : 'text-[#2A0F2E]/10'}
                            `}>
                                0{step.id}
                            </span>
                        </div>

                        {/* Texto Inferior Container */}
                        <motion.div layout className="flex flex-col gap-3 max-w-[90%] z-20 relative mt-16 md:mt-0">
                            <motion.h3
                                layout="position"
                                className={`
                                    text-xl md:text-3xl font-bold font-display leading-tight
                                    ${isActive ? 'text-white' : 'text-[#2A0F2E]'}
                                `}
                            >
                                {step.title}
                            </motion.h3>

                            {/* Descrição (Só visível se ativo) */}
                            <AnimatePresence mode="popLayout">
                                {isActive && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: 10, height: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="text-[#F3E5F5] text-sm md:text-base font-medium leading-relaxed max-w-full md:max-w-md"
                                    >
                                        {step.description}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Botão "Ver mais" (Só visível se INATIVO) */}
                            {!isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2 flex items-center gap-2 text-[#E62E81] font-bold text-xs md:text-sm uppercase tracking-wide"
                                >
                                    Ver detalhes <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
}

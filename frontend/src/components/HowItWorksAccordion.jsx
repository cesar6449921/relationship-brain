import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, MessageCircle, Heart, ArrowRight } from "lucide-react";

// Dados dos passos
const steps = [
    {
        id: 1,
        title: "Cadastro Rápido",
        description: "Crie sua conta em segundos. Só precisamos do seu nome e telefone. Sem formulários chatos.",
        icon: Lock,
        image: "https://images.unsplash.com/photo-1616077168712-fc6c788cad34?q=80&w=1000&auto=format&fit=crop", // Lock/Security abstract
        color: "bg-brand-50"
    },
    {
        id: 2,
        title: "Conexão WhatsApp",
        description: "Nossa IA cria um grupo seguro e criptografado só para vocês três (Você, Parceiro e IA).",
        icon: MessageCircle,
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop", // Chat abstract
        color: "bg-brand-100"
    },
    {
        id: 3,
        title: "Evolução Diária",
        description: "A IA aprende com vocês, media conflitos em tempo real e envia exercícios personalizados.",
        icon: Heart,
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop", // Heart/Love abstract
        color: "bg-brand-200"
    },
];

export default function HowItWorksAccordion() {
    const [activeId, setActiveId] = useState(2); // Começa com o do meio aberto

    return (
        <div className="w-full max-w-5xl mx-auto h-[400px] flex gap-4">
            {steps.map((step) => {
                const isActive = activeId === step.id;

                return (
                    <motion.div
                        key={step.id}
                        onClick={() => setActiveId(step.id)}
                        onHoverStart={() => setActiveId(step.id)} // Hover para desktop
                        className={`relative rounded-3xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ease-in-out border border-white/20`}
                        animate={{
                            flex: isActive ? 3 : 1,
                        }}
                        layout
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                        {/* Background Image com Overlay */}
                        <div className="absolute inset-0">
                            <div className={`absolute inset-0 opacity-90 ${isActive ? 'bg-brand-900/90' : 'bg-white'}`} />
                            {/* Se quisermos usar a imagem de fundo: */}
                            {/* <img src={step.image} alt="" className="w-full h-full object-cover grayscale mix-blend-overlay opacity-20" /> */}
                        </div>

                        {/* Conteúdo */}
                        <div className="relative h-full flex flex-col justify-end p-8 isolate">

                            {/* Ícone */}
                            <div className={`absolute top-8 left-8 p-3 rounded-2xl ${isActive ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'} transition-colors duration-300`}>
                                <step.icon className="w-6 h-6" />
                            </div>

                            {/* Número do Passo */}
                            <span className={`absolute top-8 right-8 text-6xl font-display font-bold opacity-10 ${isActive ? 'text-white' : 'text-slate-300'}`}>0{step.id}</span>

                            {/* Texto */}
                            <motion.div layout className="flex flex-col gap-2">
                                <motion.h3
                                    layout="position"
                                    className={`text-2xl font-bold font-display ${isActive ? 'text-white' : 'text-slate-900'}`}
                                >
                                    {step.title}
                                </motion.h3>

                                {/* Descrição só aparece quando ativo */}
                                {isActive && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-brand-100 font-medium leading-relaxed"
                                    >
                                        {step.description}
                                    </motion.p>
                                )}

                                {/* Botão Fake "Ver mais" quando inativo */}
                                {!isActive && (
                                    <div className="mt-2 flex items-center gap-2 text-brand-600 font-bold text-sm">
                                        Ver mais <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

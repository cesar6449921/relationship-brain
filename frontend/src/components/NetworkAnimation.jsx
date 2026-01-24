import { motion } from "framer-motion";

export default function NetworkAnimation() {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] opacity-90">
                {/* Linhas de Conexão - Pulse Effect */}
                <motion.g
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Linhas conectando ao centro */}
                    <line x1="200" y1="200" x2="100" y2="100" stroke="#F3E5F5" strokeWidth="2" />
                    <line x1="200" y1="200" x2="300" y2="100" stroke="#F3E5F5" strokeWidth="2" />
                    <line x1="200" y1="200" x2="100" y2="300" stroke="#F3E5F5" strokeWidth="2" />
                    <line x1="200" y1="200" x2="300" y2="300" stroke="#F3E5F5" strokeWidth="2" />
                    <line x1="200" y1="200" x2="200" y2="80" stroke="#F3E5F5" strokeWidth="2" />
                    <line x1="200" y1="200" x2="200" y2="320" stroke="#F3E5F5" strokeWidth="2" />

                    {/* Círculo Orbital Externo */}
                    <circle cx="200" cy="200" r="140" stroke="#E62E81" strokeWidth="1" strokeOpacity="0.2" fill="none" />
                    <circle cx="200" cy="200" r="100" stroke="#E62E81" strokeWidth="1" strokeOpacity="0.1" fill="none" />
                </motion.g>

                {/* Nós (Pessoas/Pontos) - Orbitando ou Flutuando */}
                {[
                    { cx: 100, cy: 100, delay: 0 },
                    { cx: 300, cy: 100, delay: 1 },
                    { cx: 100, cy: 300, delay: 2 },
                    { cx: 300, cy: 300, delay: 3 },
                    { cx: 200, cy: 80, delay: 0.5 },
                    { cx: 200, cy: 320, delay: 1.5 },
                    { cx: 80, cy: 200, delay: 2.5 },
                    { cx: 320, cy: 200, delay: 3.5 },
                ].map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.cx}
                        cy={node.cy}
                        r="12" // Tamanho maior
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: node.delay,
                            ease: "easeInOut"
                        }}
                        filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.1))"
                    />
                ))}

                {/* Ícones dentro dos nós (Simulados com cor) */}
                {[
                    { cx: 100, cy: 100, color: "#E62E81" }, // User
                    { cx: 300, cy: 100, color: "#2A0F2E" }, // Chat
                    { cx: 100, cy: 300, color: "#2A0F2E" }, // Chat
                    { cx: 300, cy: 300, color: "#E62E81" }, // User
                    { cx: 200, cy: 80, color: "#E62E81" },
                    { cx: 200, cy: 320, color: "#E62E81" },
                    { cx: 80, cy: 200, color: "#2A0F2E" },
                    { cx: 320, cy: 200, color: "#2A0F2E" },
                ].map((node, i) => (
                    <motion.circle
                        key={`inner-${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        r="6"
                        fill={node.color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                ))}

                {/* Núcelo Central (Coração/AI) - Pulsando */}
                <motion.g
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Glow effect */}
                    <circle cx="200" cy="200" r="50" fill="#E62E81" fillOpacity="0.2">
                        <animate attributeName="r" values="50;60;50" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Main Circle */}
                    <circle cx="200" cy="200" r="35" fill="#E62E81" />

                    {/* Heart Icon (Path simplificado) */}
                    <path
                        d="M200 215 C200 215 220 205 220 190 C220 180 210 175 200 185 C190 175 180 180 180 190 C180 205 200 215 200 215 Z"
                        fill="white"
                        stroke="none"
                    />
                </motion.g>
            </svg>
        </div>
    );
}

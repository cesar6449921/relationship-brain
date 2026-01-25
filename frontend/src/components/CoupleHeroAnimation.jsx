import React from 'react';

const CoupleHeroAnimation = () => {
    return (
        <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center">
            {/* Background Blob (Aura de Conexão) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-100/50 to-purple-100/50 rounded-full blur-3xl animate-pulse-slow"></div>

            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-2xl">
                {/* Person 1 (Left - Masc/Neutral) */}
                <g className="animate-float" style={{ animationDelay: '0s' }}>
                    <path
                        d="M180 200 C150 180, 120 220, 140 280 C160 340, 200 400, 250 420 C220 350, 240 250, 180 200 Z"
                        fill="url(#gradient1)"
                        className="opacity-90"
                    />
                    <circle cx="170" cy="180" r="35" fill="url(#gradient1)" />
                </g>

                {/* Person 2 (Right - Fem/Neutral) */}
                <g className="animate-float" style={{ animationDelay: '1.5s' }}>
                    <path
                        d="M320 200 C350 180, 380 220, 360 280 C340 340, 300 400, 250 420 C280 350, 260 250, 320 200 Z"
                        fill="url(#gradient2)"
                        className="opacity-90"
                    />
                    <circle cx="330" cy="180" r="35" fill="url(#gradient2)" />
                </g>

                {/* Connection Heart (Space Negative/Positive) */}
                <g className="animate-heartbeat origin-center">
                    <path
                        d="M250 280 C230 250, 200 250, 200 290 C200 330, 250 360, 250 360 C250 360, 300 330, 300 290 C300 250, 270 250, 250 280 Z"
                        fill="white"
                        fillOpacity="0.9"
                        filter="url(#glow)"
                    />
                </g>

                {/* Decorative Elements */}
                <circle cx="400" cy="100" r="10" fill="#F3E5F5" className="animate-ping-slow" style={{ animationDelay: '0.5s' }} />
                <circle cx="100" cy="400" r="8" fill="#FCE7F3" className="animate-ping-slow" style={{ animationDelay: '2s' }} />
                <circle cx="450" cy="300" r="6" fill="#E9D5FF" className="animate-float" style={{ animationDelay: '1s' }} />

                {/* Gradients & Filters */}
                <defs>
                    <linearGradient id="gradient1" x1="100" y1="100" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E62E81" /> {/* Brand-600 */}
                        <stop offset="1" stopColor="#991550" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="400" y1="100" x2="200" y2="400" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6" /> {/* AI Purple */}
                        <stop offset="1" stopColor="#6D28D9" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-heartbeat {
                    animation: heartbeat 3s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default CoupleHeroAnimation;

import React from 'react';

const GrowthAnimation = () => {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Graph Area Background */}
            <path d="M20 180 L20 100 Q60 120 100 80 T180 40 V180 H20 Z"
                fill="url(#gradientGrowth)" opacity="0.1" />

            {/* Main Graph Line */}
            <path d="M20 180 L20 100 Q60 120 100 80 T180 40"
                stroke="url(#gradientLine)" strokeWidth="4" strokeLinecap="round" className="animate-draw" />

            {/* Floating Hearts (Points) */}
            <g className="animate-float" style={{ animationDelay: '0s' }}>
                <circle cx="20" cy="180" r="4" fill="white" />
            </g>
            <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                <circle cx="60" cy="110" r="4" fill="white" />
            </g>
            <g className="animate-float" style={{ animationDelay: '1s' }}>
                <circle cx="100" cy="80" r="4" fill="white" />
            </g>
            <g className="animate-float" style={{ animationDelay: '1.5s' }}>
                <circle cx="140" cy="60" r="4" fill="white" />
            </g>
            <g className="animate-float" style={{ animationDelay: '2s' }}>
                <circle cx="180" cy="40" r="6" fill="#F472B6" stroke="white" strokeWidth="2" />
            </g>

            {/* Arrow Head */}
            <path d="M170 40 L180 40 L180 50" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            <defs>
                <linearGradient id="gradientGrowth" x1="100" y1="40" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F472B6" />
                    <stop offset="1" stopColor="#F472B6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradientLine" x1="20" y1="180" x2="180" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E879F9" />
                    <stop offset="1" stopColor="#F472B6" />
                </linearGradient>
            </defs>

            <style>{`
                 @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-draw {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: draw 2s ease-out forwards;
                }
                @keyframes draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>
    );
};

export default GrowthAnimation;

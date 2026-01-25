import React from 'react';

const SecureAnimation = () => {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Hexagon Shield Base */}
            <path d="M100 40 L160 70 V120 C160 150 135 175 100 190 C65 175 40 150 40 120 V70 L100 40 Z"
                stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" fill="none" className="text-white animate-pulse" />

            {/* Inner Lock shape (Abstract) */}
            <rect x="70" y="90" width="60" height="50" rx="8" fill="currentColor" fillOpacity="0.2" className="text-brand-500" />
            <path d="M85 90 V75 C85 65 92 58 100 58 C108 58 115 65 115 75 V90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-white opacity-80" />

            {/* Pulsing Circles (Ripples) */}
            <circle cx="100" cy="115" r="50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" className="text-brand-400 animate-ping-slow" style={{ animationDuration: '3s' }} />
            <circle cx="100" cy="115" r="70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" className="text-brand-300 animate-ping-slow" style={{ animationDelay: '1s', animationDuration: '3s' }} />

            <style>{`
                .animate-ping-slow {
                    animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </svg>
    );
};

export default SecureAnimation;

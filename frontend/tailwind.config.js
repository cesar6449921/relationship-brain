/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#FDF2F8', // Muito claro (mantido base pink)
                    100: '#F3E5F5', // Lavanda Suave (Background Card)
                    200: '#FCCDE5',
                    300: '#FAA7D0',
                    400: '#F670B0',
                    500: '#EE498F', // Um pouco mais claro que o principal
                    600: '#E62E81', // MAGENTA CONEXÃO (MAIN)
                    700: '#BF1D66',
                    800: '#991550',
                    900: '#2A0F2E', // ROXO PROFUNDO (DARK)
                },
                ai: '#8B5CF6', // Roxo Vibrante
                accent: {
                    green: '#C8F7C5', // Verde Fundo
                    lavender: '#F3E5F5', // Lavanda Suave
                },
                neutral: {
                    offwhite: '#F9F9F9', // Off-White
                    midgray: '#666666', // Cinza Médio
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'], // Para títulos (como na imagem)
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

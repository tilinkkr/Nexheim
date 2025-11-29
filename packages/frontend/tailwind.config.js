/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    DEFAULT: '#00FF88',
                    500: '#00E673'
                },
                electric: '#6BE2FF',
                violet: '#C48BFF',
                amlogo: '#060608',
                surface: 'rgba(255,255,255,0.03)',
                'glass-outline': 'rgba(120,255,150,0.08)',
                danger: '#FF6B6B',
                muted: '#9AA1A6'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            }
        },
    },
    plugins: [],
}

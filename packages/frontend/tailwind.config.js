/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // The High-End "Dark Void" Palette
                nex: {
                    bg: "#050505",       // Deepest black
                    card: "#0F1115",     // Card surface
                    stroke: "#1F2937",   // Borders
                    primary: "#6366f1",  // The main purple/blue brand
                    safe: "#10b981",     // Signal Green
                    risk: "#ef4444",     // Signal Red
                    warn: "#f59e0b",     // Signal Yellow
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glow-green': 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                'glow-red': 'radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                'glow-blue': 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                'glow-purple': 'radial-gradient(circle at center, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
            },
            boxShadow: {
                'neon-hover': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
                'neon-green': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
                'neon-red': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}

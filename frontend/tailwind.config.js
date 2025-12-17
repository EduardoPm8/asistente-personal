/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // Zinc 950
                surface: '#18181b',    // Zinc 900
                surfaceHighlight: '#27272a', // Zinc 800
                primary: '#6366f1',    // Indigo 500
                secondary: '#a1a1aa',  // Zinc 400
                accent: '#8b5cf6',     // Violet 500
                success: '#10b981',    // Emerald 500
                warning: '#f59e0b',    // Amber 500
                error: '#ef4444',      // Red 500
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}

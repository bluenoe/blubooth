import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            animation: {
                'float-slow': 'float-slow 6s ease-in-out infinite',
                'float-medium': 'float-medium 5s ease-in-out infinite',
                'float-fast': 'float-fast 4s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
            },
            keyframes: {
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(-6deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(-4deg)' },
                },
                'float-medium': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(4deg)' },
                    '50%': { transform: 'translateY(-15px) rotate(6deg)' },
                },
                'float-fast': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(2deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(0deg)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            backdropBlur: {
                '3xl': '64px',
            },
        },
    },

    plugins: [forms],
};

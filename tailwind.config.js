import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{js,jsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                waveRise: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(4px)' },
                },
            },
            animation: {
                'fade-in-down': 'fadeInDown 0.6s ease-out both',
                'fade-in-up': 'fadeInUp 0.6s ease-out both',
                'fade-in': 'fadeIn 0.8s ease-out both',
                'wave-rise': 'waveRise 0.8s ease-out both',
            },
        },
    },

    plugins: [forms],
};

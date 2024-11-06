/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        '~/components/**/*.vue',
        '~pages/**/*.vue',
        '~/app.vue',
        '~/error.vue'
    ],
    theme: {
        extend: {
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
            },
            colors: {
                'color': {
                    'turquoise': '#6DC1C5',
                    'gray': '#9CA3AF',
                    'lightgray': '#F3F4F6',
                    'black': '#000000',
                    'white': '#FFFFFF',
                    'red': '#DF6363'
                },
            },
            fontSize: {
                'xs': '.75rem',
                'sm': '.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
            }
        },
    },
    plugins: [],
}

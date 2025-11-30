/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#003366', // Azul marinho
                'secondary-green': '#28a745', // Verde
                'tertiary-info': '#17a2b8', // Azul claro
                'error-red': '#dc3545', // Vermelho
            },
        },
    },
    plugins: [],
}
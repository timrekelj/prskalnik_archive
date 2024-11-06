import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    meta: {
        link: [
            {
                href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0",
                rel: "stylesheet"
            }
        ],
    },
    build: {
        transpile: [
            'vue-sonner',
            '@nuxt/supabase'
        ]
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/supabase',
    ],
    dependencies: [
        'vue-select'
    ],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    tailwindcss: {
        cssPath: '~/assets/css/styles.css',
    },
    supabase: {
        redirect: false,
    }
});

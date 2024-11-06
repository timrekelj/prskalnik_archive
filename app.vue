<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

useHead({
    title: "Prskalnik",
    link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'}
    ]
})
</script>

<template>
    <ClientOnly>
        <Toaster
            position="top-left"
            closeButton
            richColors
            :expand="true"
        />
    </ClientOnly>
    <div class='all'>
        <div class='header-page'>
            <Header/>
            <NuxtPage/>
        </div>
        <Footer/>
        <CookiePrompt/>
    </div>
</template>

<style>
.all {
    @apply flex flex-col h-screen select-none;
}

.header-page {
    @apply flex-grow mx-[10%];
}

.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 100,
    'opsz' 48
}
</style>

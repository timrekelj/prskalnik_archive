<script lang='ts'>
import type { Database } from '~/types/supabase';

export default {
    data: () => ({
        authenticated: false,
        company: false,
        user: [],
        isOpen: false,
    }),
    async mounted() {
        const user = useSupabaseUser();
        const supabase = useSupabaseClient<Database>();

        this.authenticated = user.value ? true : false;
        this.company = this.authenticated ? ((await supabase.from('companies').select().eq('id', user.value!.id)).data?.length == 1 ? true : false) : false;

        supabase.auth.onAuthStateChange(async (event: string, session: any) => {
            if (event === 'SIGNED_IN') {
                this.authenticated = true;
                this.company = ((await supabase.from('companies').select().eq('id', user.value!.id)).data?.length) == 1 ? true : false;
            } else if (event === 'SIGNED_OUT') {
                this.authenticated = false;
                this.company = false;
            }
        })
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen
        },
        async logout() {
            const {auth} = useSupabaseClient<Database>();
            const {error} = await auth.signOut();
            return navigateTo('/');
        }
    }
}
</script>
<template>
    <nav class='my-16'>
        <div class='flex items-center justify-between'>
            <NuxtLink class='font-bold text-4xl text-color-turquoise' to='/'>PRSKALNIK</NuxtLink>
            <ul class='hidden md:block float-right'>
                <li class='inline-block'>
                    <ZeldaUrl class="m-3" to="/onas">O nas</ZeldaUrl>
                </li>
                <li v-if='!authenticated' class='inline-block'>
                    <ZeldaUrl class='m-3' to='/uporabniki/prijava'>Prijava</ZeldaUrl>
                </li>
                <li v-if='!authenticated' class='inline-block'>
                    <BenjaminUrl class="m-3" to="/uporabniki/registracija">Registracija</BenjaminUrl>
                </li>
                <li v-if='authenticated && !company' class='inline-block'>
                    <ZeldaUrl class='m-3' to='/iskanje'>Iskalnik</ZeldaUrl>
                </li>
                <li v-if='authenticated && company' class='inline-block'>
                    <ZeldaUrl class='m-3' to='/nadzornaplosca'>Nadzorna plošča</ZeldaUrl>
                </li>
                <li v-if='authenticated' class='inline-block'>
                    <ZeldaUrl class='m-3' to="/uporabniki/nastavitve">Nastavitve</ZeldaUrl>
                </li>
                <li v-if='authenticated' class='inline-block'>
                    <Benjamin class="ml-3" @click="logout()">Odjava</Benjamin>
                </li>
            </ul>
            <div class='block md:hidden ' v-on:click='toggle()'>
                <div class='w-5 h-0.5 bg-color-turquoise'></div>
                <div class='w-5 h-0.5 bg-color-turquoise my-1'></div>
                <div class='w-5 h-0.5 bg-color-turquoise'></div>
            </div>
        </div>
        <ul :class='isOpen ? "block" : "hidden"' class='text-right'>
            <li class='mt-5'>
                <ZeldaUrl to="/onas" @click="toggle()">O nas</ZeldaUrl>
            </li>
            <li v-if='!authenticated' class='mt-3'>
                <ZeldaUrl to='/uporabniki/prijava' @click='toggle'>Prijava</ZeldaUrl>
            </li>
            <li v-if='!authenticated' class='mt-6'>
                <BenjaminUrl to='/uporabniki/registracija' @click='toggle'>Registracija</BenjaminUrl>
            </li>
            <li v-if='authenticated && !company' class='my-3'>
                <ZeldaUrl to='/iskanje' @click='toggle'>Iskalnik</ZeldaUrl>
            </li>
            <li v-if='authenticated && company' class='my-3'>
                <ZeldaUrl to='/nadzornaplosca' @click='toggle'>Nadzorna plošča</ZeldaUrl>
            </li>
            <li v-if='authenticated' class='my-3'>
                <ZeldaUrl to='/uporabniki/nastavitve' @click="toggle">Nastavitve</ZeldaUrl>
            </li>
            <li v-if='authenticated' class='mt-6'>
                <Benjamin @click="logout(); toggle()">Odjava</Benjamin>
            </li>
        </ul>
    </nav>
</template>

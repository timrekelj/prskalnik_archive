<script lang='ts' setup>
import { type Database } from '~/types/supabase'
import { toast } from 'vue-sonner'

definePageMeta({
    middleware: ['logged-in'],
})
</script>

<script lang='ts'>
export default {
    data: () => ({
        email: '',
        password: '',
        wrongCreds: false,
        emptyField: false,
        supabase: useSupabaseClient()
    }),
    methods: {
        async loginSupabaseUser(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const { auth } = useSupabaseClient<Database>()
                const {error} = await auth.signInWithPassword({
                    email: this.email,
                    password: this.password,
                })

                if (error) resolveErr(error.message)
                else resolveSucc("yay")
            })
        },
        async loginWithEmail() {
            if (this.email === '' || this.password === '') {
                toast.error("Prosimo, da izpolnite vsa polja.")
                return
            } else {
                this.emptyField = false
            }

            toast.promise(this.loginSupabaseUser, {
                loading: 'Prijava...',
                success: (data: any) => {
                    navigateTo('/')
                    return 'Prijava uspešna'
                },
                error: (data: any) => {
                    if(data === 'Invalid login credentials') {
                        return 'Vnešeni podatki so napačni. Poskusi znova.'
                    } else {
                        return 'Prišlo je do napake pri prijavi'
                    }
                },
            })
        },
        goToForgotPass() {
            navigateTo('/uporabniki/pozabljenogeslo')
        }
    }
}
</script>

<template>
    <div class='grid-for-couples'>
        <div class='grid-breakup'>
            <Richard>Pozdravljen uporabnik/ca!</Richard>
            <div class='text-lg md:w-[80%] sm:mb-10'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </div>
        <div>
            <Richard>Prijavi se</Richard>
            <form @submit.prevent='loginWithEmail'>
                <input id="email" v-model="email" class="text-field-split" placeholder="Elektronski naslov" type="email"/>
                <input id='password' v-model='password' class='text-field-split mb-5' placeholder='Geslo' type='password'/><br>
                <Benjamin>Prijavi se</Benjamin><br>
                <Zelda @click="goToForgotPass">Ste pozabili svoje geslo?</Zelda>
            </form>
        </div>
    </div>
</template>

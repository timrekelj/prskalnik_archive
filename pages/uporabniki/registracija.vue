<script lang='ts' setup>
import { toast } from 'vue-sonner'
import { type Database } from '~/types/supabase'

definePageMeta({
    middleware: 'logged-in'
})
</script>

<script lang='ts'>
export default {
    data: () => ({
        email: '',
        password: '',
        repeat_password: '',
        existingUser: false,
    }),
    methods: {
        async registerSupabaseUser(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const { auth } = useSupabaseClient<Database>()
                const { error } = await auth.signUp({
                    email: this.email,
                    password: this.password,
                })

                if (error) resolveErr(error.message)
                else resolveSucc("yay")
            })
        },
        async registerWithEmail() {
            if (this.password.length < 8) {
                toast.error("Geslo mora vsebovati vsaj 8 znakov")
                return
            } else if (!this.password.match(/(?=.*?[a-z])/)) {
                toast.error("Geslo mora vsebovati vsaj 1 majhno črko")
                return
            } else if (!this.password.match(/(?=.*?[A-Z])/)) {
                toast.error("Geslo mora vsebovati vsaj 1 veliko črko")
                return
            } else if (!this.password.match(/(?=.*?[0-9])/)) {
                toast.error("Geslo mora vsebovati vsaj 1 številko")
                return
            } else if (this.password != this.repeat_password) {
                toast.error("Gesli se ne ujemata")
                return
            }

            toast.promise(this.registerSupabaseUser, {
                loading: 'Registracija...',
                success: (data: any) => {
                    navigateTo('/uporabniki/potrditev')
                    return 'Registracija uspešna'
                },
                error: (data: any) => 'Prišlo je do napake pri registraciji',
            });
        }
    }
}
</script>

<template>
    <div>
        <div class='grid-for-couples'>
            <div class='grid-breakup'>
                <Richard>Pozdravljen uporabnik/ca!</Richard>
                <div class='text-lg md:w-[80%] sm:mb-10'>
                    Lorem ipsum dolor amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore
                    magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo
                    consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla
                    pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id
                    est laborum.
                </div>
            </div>
            <div>
                <Richard>Registriraj se</Richard>
                <form @submit.prevent='registerWithEmail'>
                    <input id='email' v-model='email' class='text-field-split' placeholder='elektronski naslov' type='email'/><br>
                    <input id='password' v-model='password' class='text-field-split' placeholder='geslo' type='password'/><br>
                    <input id='repeat_password' v-model='repeat_password' class='text-field-split mb-5' placeholder='Ponovi geslo' type='password'/><br>
                    <Benjamin>Registriraj se</Benjamin>
                </form>
            </div>
        </div>
    </div>
</template>

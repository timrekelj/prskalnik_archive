<script lang="ts" setup>
import { toast } from 'vue-sonner'
import { type Database } from '~/types/supabase'
</script>

<script lang="ts">
export default {
    data: () => ({
        password: '',
        repeatPassword: ''
    }),
    methods: {
        async updateSupabasePassword(): Promise<string> {
            return new Promise(async (resolveSucc, resolveErr) => {
                const { auth } = useSupabaseClient<Database>()
                const { data, error } = await auth.updateUser({
                    password: this.password
                })

                if (error) resolveErr(error)
                else resolveSucc(data.toString())
            })
        },
        newPass: async function () {
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
            } else if (this.password != this.repeatPassword) {
                toast.error("Gesli se ne ujemata")
                return
            }

            // register the user
            const supabase = useSupabaseClient<Database>()
            const { token_hash, type } = Object.fromEntries(new URLSearchParams(window.location.search))
            const { data: { session }, error: err } = await supabase.auth.verifyOtp({ token_hash, type })

            if (err) {
                toast.error(err.message)
                return
            }

            toast.promise(this.updateSupabasePassword, {
                loading: 'Ponastavljanje gesla...',
                success: (data: any) => {
                    navigateTo('/', { replace: true })
                    return 'Geslo uspešno ponastavljeno'
                },
                error: (data: any) => {
                    if (data.message === 'New password should be different from the old password.') {
                        return 'Novo geslo se mora razlikovati od starega'
                    } else {
                        return 'Prišlo je do napake pri zamenjavi gesla'
                    }
                },
            })
        }
    }
}
</script>

<template>
    <div class='grid-for-couples'>
        <div class="grid-breakup">
            <Richard>Zdravo!</Richard>
            <div class='message'>lorem ipsum</div>
        </div>
        <div>
            <Richard>Zamenjaj geslo</Richard>
            <form class='block' @submit.prevent='newPass'>
                <input id='password' v-model='password' class='text-field-split' placeholder='Vnesi novo geslo' type='password'/>
                <br>
                <input id='repeatPassword' v-model='repeatPassword' class='text-field-split mb-5' placeholder='Ponovi geslo' type='password'/>
                <br>
                <Benjamin>Ponastavi geslo</Benjamin>
            </form>
        </div>
    </div>
</template>
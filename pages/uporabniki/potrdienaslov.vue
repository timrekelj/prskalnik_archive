<script lang='ts' setup>
import { type Database } from '~/types/supabase'
import { toast } from 'vue-sonner'
</script>

<script lang="ts">
export default {
    data: () => ({}),
    async mounted() {
        const supabase = useSupabaseClient<Database>()
        // register the user
        const { token_hash, type } = Object.fromEntries(new URLSearchParams(window.location.search))
        const { error: verify_error } = await supabase.auth.verifyOtp({ token_hash, type })

        if (verify_error) {
            toast.error(verify_error.message)
            return
        }
    }
}
</script>

<template>
    <div>
        Potrjen email
    </div>
</template>

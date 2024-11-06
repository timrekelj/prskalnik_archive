<script lang='ts'>
export default {
    data: () => ({
        email: ''
    }),
    methods: {
        resetPassword: async function () {
            const {auth} = useSupabaseClient();
            const {data, error} = await auth.resetPasswordForEmail(
                this.email,
            );
            if (!error) navigateTo('/');
        }
    }
}
</script>

<template>
    <div class='grid-for-couples'>
        <div class="grid-breakup">
            <Richard>Zdravo!</Richard>
            <div>
                Brez bojazni, še vedno lahko dostopaš do svojega uporabniškega profila, samo ponastaviti moraš geslo. To
                storiš tako, da v sosednje polje vpišeš svoj elektronski naslov in nato počakaš na sporočilo.
            </div>
        </div>
        <div>
            <Richard>Pozabljeno Geslo</Richard>
            <form @submit.prevent="resetPassword">
                <input id="email" v-model="email" class='mb-5 text-field-split' placeholder="Email" type="email">
                <br>
                <Benjamin>Ponastavi</Benjamin>
            </form>
        </div>
    </div>
</template>

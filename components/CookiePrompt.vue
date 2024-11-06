<script>
export default {
    data: () => ({
        isOpen: false,
    }),
    mounted() {
        if (!this.getGDPR()) {
            this.isOpen = true;
        }
    },
    methods: {
        getGDPR() {
            if (process.client) {
                return localStorage.getItem('GDPR:accepted') === 'true';
            }
        },
        accept() {
            this.isOpen = false;
            localStorage.setItem('GDPR:accepted', true);
        },
        deny() {
            this.isOpen = false;
            localStorage.setItem('GDPR:accepted', false);
        }
    },
}
</script>

<template>
    <div v-if='isOpen' class='mx-[10%] w-4/5 bottom-10 fixed drop-shadow-lg rounded-lg bg-white p-5 bg-[#FDFDFD] sm:inline-flex'>
        <div class='text-color-gray mb-5 sm:mr-5 sm:mb-0'>
            Naša spletna stran za nemoteno delovanje uporablja piškotke? Ali se za boljšo uporabniško izkušnjo strinjate z uporabo piškotkov? Več o piškotkih si lahko prebereš na
            <NuxtLink class='text-color-turquoise' to='/piskotki'>tej strani</NuxtLink>.
        </div>
        <div class='inline-flex space-x-4 sm:ml-auto'>
            <Benjamin @click="accept" class="flex justify-center h-12 w-12 items-center self-center">
                <span class='material-symbols-outlined'>check</span>
            </Benjamin>
            <BenjaminRedInverted @click="deny" class="flex justify-center h-12 w-12 items-center self-center">
                <span class='material-symbols-outlined'>close</span>
            </BenjaminRedInverted>
        </div>
    </div>
</template>
<script lang='ts' setup>
definePageMeta({
    middleware: 'logged-in',
})
</script>

<template>
    <Richard>Preveri svoj poštni nabiralnik</Richard>
    <div class='text-lg mb-5'>
        Na elektronski naslov smo ti poslali povezavo do aktivacije tvojega uporabniškega računa. Prosim aktiviraj račun preden nadaljuješ z iskanjem primernega praktičnega usposabljanja.
    </div>
    <div class='text-color-gray'>
        Elektronskega sporočila nisi prejel? Preveri tudi mapo <span class='font-bold'>vsiljena pošta</span>.
    </div>
</template>

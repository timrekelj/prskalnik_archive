<script>
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    }

}
</script>

<template>
    <div class='flex h-screen '>
        <div class='m-auto'>
            <h1 class='text-color-turquoise text-9xl text-center font-extrabold'> {{ error.statusCode }}</h1>
            <div v-if='error.statusCode == 404' class='m-4'>
                <p class='text-center font-bold text-2xl'>Izbrane strani nismo uspeli najti.
                    Vrni se nazaj na
                    <NuxtLink class='text-color-turquoise' to='/'> domačo stran</NuxtLink>
                    in
                    poskusi svojo srečo še enkrat
                </p>
            </div>
            <div v-else-if='error.statusCode == 500' class='m-4'>
                <p class='text-center font-bold text-2xl'>Bad gateway? Server? Ne odziva se? Kaj?
                    Pridi nas pogledat čez par minut in
                    poskusi svojo srečo še enkrat</p>
            </div>
            <div v-else class='m-4'>
                <p class='text-center font-bold text-2xl'>Neznana napaka ampak bo delal.
                    Pridi nas pogledat čez par minut in
                    poskusi svojo srečo še enkrat</p>
            </div>
        </div>
    </div>
</template>
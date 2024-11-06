<script lang='ts' setup>
definePageMeta({
    middleware: ['is-company', 'is-user']
})
</script>

<template>
    <div class='mb-16 lg:mb-32'>
        <div class='text-5xl font-bold'>Poišči si <span class='text-color-turquoise'>prakso</span>, ki ti ustreza</div>
        <div class='text-2xl mb-16'>in pomagali ti bomo stopiti v stik z delodajalcem.</div>
        <BenjaminUrl class="text-base lg:text-lg" to="/uporabniki/registracija">Vstopi v svet novih priložnosti</BenjaminUrl>
    </div>

    <div class='lg:justify-between lg:flex space-y-8 lg:space-y-0 mb-16 lg:mb-32'>
        <div><a href='https://socialimpactaward.net/'><img alt='Social Impact Hub' class='h-[45px]' src='~/assets/images/sia.svg'></a></div>
        <div><a href='https://majavoje.com/'><img alt='Growth Lab' class='h-[45px]' src='~/assets/images/growth_lab.svg'></a></div>
        <div><a href='https://rskupina.si/'><img alt='RSkupina' class='h-[45px]' src='~/assets/images/r_skupina.svg'></a></div>
        <div><a href='https://strojnik.si/'><img alt='Strojnik.si' class='h-[40px]' src='~/assets/images/strojnik_si.svg'></a></div>
        <div><a href='https://douchebag.si/'><img alt='Miha Medven' class='h-[45px]' src='~/assets/images/miha_medven.svg'></a></div>
    </div>

    <div class='mb-16'>
        <div class='text-4xl font-bold'>Kako deluje <span class='text-color-turquoise'>Prskalnik.si?</span></div>
        <div class='text-lg'>Oglej si kako deluje portal in začni z iskanjem svoje sanjske prakse.</div>
    </div>

    <div class='mb-16 grid grid-cols-1 gap-10 lg:grid-cols-3'>
        <div>
            <div class='steps-number'>1</div>
            <div class='steps-title'>Ustvari račun</div>
            <div class='steps-line'></div>
            <div class='steps-body'>Preden začneš z iskanjem prakse moraš ustvariti račun.</div>
            <ZeldaUrlInverted to="/uporabniki/registracija">Registracija</ZeldaUrlInverted>
        </div>
        <div>
            <div class='steps-number'>2</div>
            <div class='steps-title'>Najdi delodajalca</div>
            <div class='steps-line'></div>
            <div class='steps-body'>
                V iskalniku si po področju dela ali regiji poišči primernega delodajalca za opravljanje prakse.
            </div>
        </div>
        <div>
            <div class='steps-number'>3</div>
            <div class='steps-title'>Pošlji povpraševanje</div>
            <div class='steps-line'></div>
            <div class='steps-body'>
                Ko izpolniš kviz in dokažeš, da imaš osnovna znanja se prijavi na prakso in počakaj da se ti oglasijo nazaj.
            </div>
        </div>
    </div>

    <div class='text-4xl font-bold mb-5'>Pogosta <span class='text-color-turquoise'>vprašanja</span></div>
    <div class='mb-5'>
        <div class='text-2xl font-extrabold text-color-turquoise'>Kaj je portal prskalnik.si?</div>
        <div class='text-lg'>
            Prskalnik - prvi iskalnik prakse je edino orodje na trgu, ki iskalcem
            praktičnega usposabljanja, dijakom in študentom, omogoča enostavno iskanje ponudnikov
            praktičnega usposabljanja - delodajalcev.
        </div>
    </div>
    <div class='mb-5'>
        <div class='text-2xl font-extrabold text-color-turquoise'>Komu je namenjen portal prskalnik.si?</div>
        <div class='text-lg'>
            Prskalnik je namenjen vsem dijakom srednjih poklicnih in tehniških šol ne glede
            na to ali izobražujejo v naravoslovni ali bolj v družboslovni smeri, prav tako pa je namenjen
            vsem študentom visokih in višjih šol v Republiki Sloveniji, ki imajo v programu obvezno
            praktično usposabljanje.
        </div>
    </div>
    <div class="mb-5">
        <div class='text-2xl font-extrabold text-color-turquoise'>Kako se portal prskalnik.si razlikuje od študentskih servisov?</div>
        <div class='text-lg'>
            Prskalnik.si je prvi portal za iskanje praktičnega usposabljanja na vseh ravneh
            izobraževanja. Študentski servisi ponujajo študentsko in počitniško delo, medtem, ko se
            prskalnik.si osredotoča na praktična usposabljanja. Študentski servisi se preživljajo tako, da
            od vsake izplačane ure študentu poberejo delež plačila za svoje delovanje, medtem, ko se
            prskalnik.si tega izogiba in je za dijake ter študente popolnoma brezplačen in brez dodatnih
            skritih stroškov.
        </div>
    </div>
</template>

<style>
.steps-number {
    @apply text-5xl text-color-turquoise font-bold mb-1;
}

.steps-title {
    @apply text-2xl font-bold;
}

.steps-line {
    @apply border-t-4 border-color-turquoise w-24 mt-2 mb-3;
}

.steps-body {
    @apply text-lg mb-4;
}

img {
    filter: grayscale(100%);
    opacity: 50%;
    transition: 300ms ease-in-out;
}

img:hover {
    filter: grayscale(0%);
    opacity: 100%;
    transform: scale(1.1);
    transition: 300ms ease-in-out;
}
</style>

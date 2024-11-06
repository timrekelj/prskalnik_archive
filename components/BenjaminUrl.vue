<!-- nuxtlink button -->
<script lang="ts" setup>
defineProps(["to"])
</script>

<template>
<NuxtLink :to="to" class="text-lg font-bold text-color-white bg-color-turquoise duration-300 hover:bg-white hover:text-color-turquoise border-2 border-color-turquoise rounded-lg px-5 py-2">
    <slot/>
</NuxtLink>
</template>
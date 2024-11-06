<!-- text link but nuxtlink -->
<script lang="ts" setup>
defineProps(["to"])
</script>

<template>
<NuxtLink :to="to" class="text-color-black text-lg hover:text-color-turquoise duration-300">
    <slot/>
</NuxtLink>
</template>
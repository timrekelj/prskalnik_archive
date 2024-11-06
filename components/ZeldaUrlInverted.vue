<!-- text link but nuxtlink inverted -->
<script lang="ts" setup>
defineProps(["to"])
</script>

<template>
<NuxtLink :to="to" class="hover:text-color-black text-lg text-color-turquoise duration-300">
    <slot/>
</NuxtLink>
</template>
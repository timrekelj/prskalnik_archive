<script lang="ts">
import { type Job } from '~/types/job'

export default {
    props: {
        job: {
            type: Object as PropType<Job>,
            required: true,
        },
    }
}
</script>

<template>
<div class='p-5 border rounded-lg hover:border-color-turquoise hover:shadow-lg'>
    <div class='text-lg mb-1'>
        <b>{{ job.title }}</b>
    </div>
    <div class='text-sm text-color-gray mb-1 inline-flex items-center'>
        <span class='material-symbols-outlined mr-2'>school</span>
        <div>{{ job.profession }}</div>
    </div>
    <br>
    <div class='text-sm text-color-gray mb-1 inline-flex items-center'>
        <span class='material-symbols-outlined mr-2'>location_on</span>
        <div>{{ job.location }}, {{ job.region }}</div>
    </div>
    <br>
    <div class='text-sm text-color-gray inline-flex items-center'>
        <span class='material-symbols-outlined mr-2'>payments</span>
        <div>Nagrada {{ job.reward ? 'je' : 'ni' }} prisotna</div>
    </div>
</div>
</template>
<script lang='ts' setup>
import { type Database } from '~/types/supabase';
import { type Job } from '~/types/job';

definePageMeta({
    middleware: ['not-logged-in', 'is-user']
});
</script>

<script lang='ts'>
export default {
    data: () => ({
        jobs: [] as Job[]
    }),
    async mounted() {
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();
        if (user.value)
            this.jobs = (await supabase.from('jobs').select('*').eq("company_id", user.value.id).order('created_at', { ascending: false })).data ?? [];
    },
    methods: {
        selectAd(job: Job) {
            navigateTo('/urejanje?id=' + job.id.toString())
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 w-full mb-16">
        <div class="col-span-2 text-lg">
            <div class="font-bold">Dobrodošli v svoj prostor na Prskalniku</div>
            <div>Iz te strani lahko upravljate vse svoje dosedanje oglase, jih posodabljate, brišete in ustvarjate nove</div>
        </div>
        <div class="flex mt-4 md:mt-0 md:justify-end items-baseline">
            <BenjaminUrl to="/novo">Objavi nov oglas</BenjaminUrl>
        </div>
    </div>
    <div class="text-color-gray" v-if="jobs.length == 0">
        <div class="text-3xl font-bold">Trenutno nimate nobenega aktivnega oglasa</div>
        <div class="">Za objavo novega oglasa kliknite na gumb zgoraj</div>
    </div>
    <Richard v-if="jobs.length > 0">Tvoji aktivni oglasi</Richard>
    <div class="grid 2xl:grid-cols-4 lg:grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1 w-[100%]">
        <div v-for='job in jobs' :key='job' @click='selectAd(job)'>
            <JobCard :job='job'/>
        </div>
    </div>
</template>

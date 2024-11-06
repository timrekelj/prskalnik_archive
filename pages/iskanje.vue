<script lang='ts' setup>
import { type Database } from '~/types/supabase'
import { type Job } from '~/types/job'


definePageMeta({
    middleware: ['not-logged-in', 'is-company'],
})
</script>

<script lang='ts'>
export default {
    data() {
        return {
            jobs: [] as Job[],
            regions: [] as { region: string | null; }[],
            filtered: new Set(),
        }
    },
    async created() {
        const supabase = useSupabaseClient<Database>()
        this.jobs = (await supabase.from('jobs').select('*').order('created_at', {ascending: false})).data ?? []
        this.regions = (await supabase.from('regions').select('*')).data ?? []
    },
    methods: {
        toggleRegion(region: string | null) {
            if (this.filtered.has(region)) {
                this.filtered.delete(region)
            } else {
                this.filtered.add(region)
            }
        },
        selectAd(job: Job) {
            navigateTo('/oglas?id=' + job.id.toString())
        }
    },
    computed: {
        selectedRegions() {
            return [...this.regions].filter((region: {region: string | null}) => {
                return (this.filtered.has(region.region))
            });
        },
        unselectedRegions() {
            return [...this.regions].filter((region: {region: string | null}) => {
                return (!this.filtered.has(region.region))
            });
        },
        filteredJobs() {
            return [...this.jobs].filter((job: any) => {
                return (this.filtered.has(job.region) || this.filtered.size === 0);
            })
        }
    },
}
</script>

<template>
    <Richard>Iskalnik</Richard>
    <div class="mb-5 text-lg">
        Razpoložljivi filtri:
        <div class='flex overflow-x-auto md:flex-wrap'>
            <div v-for='region in unselectedRegions' v-on:click='toggleRegion(region.region)'>
                <div v-if='!filtered.has(region.region)' class='cursor-pointer p-2 mr-2 mb-2 rounded-lg text-color-white bg-color-turquoise whitespace-nowrap'>
                    {{ region.region }}
                </div>
            </div>
        </div>
    </div>
    <div class="mb-5 text-lg" v-if='selectedRegions.length !== 0'>
        Vklopljeni filtri:
        <div class='flex overflow-x-auto md:flex-wrap'>
            <div v-for='region in selectedRegions' v-on:click='toggleRegion(region.region)'>
                <div v-if='filtered.has(region.region)' class='cursor-pointer p-2 mr-2 mb-2 rounded-lg bg-color-turquoise font-semibold text-color-white'>
                        {{ region.region }}
                </div>
            </div>
        </div>
    </div>

    <div class="text-color-gray" v-if="filteredJobs.length == 0">
        <div class="text-3xl font-bold">Ni zadetkov</div>
        <div>Poskusite z drugimi filtri</div>
    </div>

    <div class='grid 2xl:grid-cols-4 lg:grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1 w-[100%]'>
        <div v-for='job in filteredJobs' :key='job' @click='selectAd(job)'>
            <JobCard :job='job'/>
        </div>
    </div>
</template>

<script lang='ts' setup>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { type Job } from '~/types/job'
import { type Database } from '~/types/supabase'
import { toast } from 'vue-sonner'
import Fuse from 'fuse.js'


definePageMeta({
    middleware: ['not-logged-in', 'is-user']
})
</script>

<script lang='ts'>
export default {
    data: () => ({
        job: <Job>{},
        picked: 'yes',
        regions: [] as {region: string | null}[] | null,
        supabase: {} as Database,

        new_title: "",
        new_description: "",
        new_profession: "",
        new_location: "",
        new_requirement: "",
        new_responsibility: "",
        new_offer: "",
        new_reward: true,
        new_region: "",
    }),
    async mounted() {
        const supabase = useSupabaseClient<Database>()
        const { id } = Object.fromEntries(new URLSearchParams(window.location.search))

        if (!id || !supabase) navigateTo('/iskanje')
            
        const { data } = await supabase.from('jobs').select().eq('id', id)
        if (!data) return

        this.job = data[0]
        this.new_region = this.job.region
        this.new_reward = this.job.reward
        if (!this.new_reward) this.picked = "no"
        this.regions = (await supabase.from('regions').select('*')).data
        console.log(this.regions)
    },
    methods: {
        fuseSearch(options: any[], search: string) {
            const fuse = new Fuse(options, {
                keys: ['region'],
            })
            return fuse.search(search).map(({ item }) => item)
        },
        async updateJob() {
            this.job.title = this.new_title != "" ? this.new_title : this.job.title
            this.job.profession = this.new_profession != "" ? this.new_profession : this.job.profession
            this.job.location = this.new_location != "" ? this.new_location : this.job.location
            this.job.region = this.new_region != "" ? this.new_region : this.job.region
            this.job.reward = this.new_reward
            this.job.description = this.new_description != "" ? this.new_description : this.job.description

            toast.promise(this.updateSupabaseJob, {
                loading: 'Spreminjanje oglasa...',
                success: (data: any) => 'Oglas je bil spremenjen',
                error: (data: any) => 'Error',
            });
        },
        async removeJob() {
            toast.error('Potrdite izbris oglasa', {
                action: {
                    label: 'Izbriši',
                    onClick: () => {
                        toast.promise(this.removeSupabaseJob, {
                            loading: 'Brisanje oglasa...',
                            success: (data: any) => {
                                navigateTo('/nadzornaplosca')
                                return 'Oglas je bil izbrisan'
                            },
                            error: (data: any) => 'Napaka pri brisanju oglasa',
                        })
                        
                    }
                },
            })
        },
        changeRadio(chosen: string) {
            if (chosen == "yes") {
                this.new_reward = true
                this.picked = "yes"
            } else {
                this.new_reward = false
                this.picked = "no"
            }
        },
        remove_requirement(requirement: string) {
           this.job.requirements = this.job.requirements!.filter(item => item != requirement) 
        },
        add_requirement() {
           if (this.new_requirement == "") return
           this.job.requirements!.push(this.new_requirement)
           this.new_requirement = ""
        },
        remove_responsibility(responsibility: string) {
           this.job.responsibilities = this.job.responsibilities.filter(item => item != responsibility) 
        },
        add_responsibility() {
           if (this.new_responsibility == "") return
           this.job.responsibilities.push(this.new_responsibility)
           this.new_responsibility = ""
        },
        remove_offer(offer: string) {
           this.job.offers = this.job.offers!.filter(item => item != offer) 
        },
        add_offer() {
           if (this.new_offer == "") return
           this.job.offers?.push(this.new_offer)
           this.new_offer = ""
        },
        async updateSupabaseJob(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()

                const { error: update_error } = await supabase.from('jobs').update(this.job).eq('id', this.job.id)

                if (update_error) resolveErr(update_error)
                resolveSucc("yay")
            })
        },
        async removeSupabaseJob(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()
                const { data, error } = await supabase.from('jobs').delete().eq('id', this.job.id)
                if (error) resolveErr(error)
                else resolveSucc("Success")
            })
        },
    }
}
</script>

<template>
    <Richard>Uredi oglas</Richard>
    <div class='grid-for-couples'>
        <div class='grid-breakup'>
            <JobCard :job="job"></JobCard>
        </div>
        <div>
            <div class="text-color-gray">Delovno mesto</div>
            <input id='new_title' v-model='new_title' class='text-field-split' :placeholder="job.title" type='text'/>
            <br>
            
            <div class="text-color-gray">Smer izobraževanja</div>
            <input id='new_profession' v-model='new_profession' class='text-field-split' :placeholder="job.profession" type='text'/>
            <br>

            <div class="text-color-gray">Lokacija dela</div>
            <input id='new_location' v-model='new_location' class='text-field-split' :placeholder="job.location" type='text'/>
            <br>

            <div class='text-color-gray'>Regija</div>
            <v-select :filter="fuseSearch" v-model="new_region" class="dropdown-select" label="region" :reduce="region => region.region" :options='regions'></v-select>
            <br>
            
            <div class='text-color-gray mb-1'>Nagrada</div>
            <div class='mb-1' v-on:click='changeRadio("yes")'>
                <input v-model="picked"
                        :class='new_reward ? "bg-color-black" : "bg-color-gray"'
                        class='appearance-none rounded-full h-3 w-3' type="radio"
                        value="yes">
                <label :class="new_reward ? 'text-color-black' : 'text-color-gray'" class='ml-2' for="yes">Nagrada je prisotna</label>
                <br>
            </div>

            <div class='mb-3' v-on:click='changeRadio("no")'>
                <input v-model="picked"
                        :class='new_reward ? "bg-color-gray" : "bg-color-black"'
                        class='appearance-none rounded-full h-3 w-3' type="radio"
                        value="no">
                <label :class="new_reward ? 'text-color-gray' : 'text-color-black'" class='ml-2' for="no">Nagrada ni prisotna</label>
                <br>
            </div>

            <div class='text-color-gray mb-1'>Opis dela</div>
            <textarea v-model='new_description' :placeholder='job.description' class="text-field-split"/>
            <br>

            <form @submit.prevent='add_requirement'>
                <div class='text-color-gray mb-1'>Zahtevano znanje</div>
                <ul class="mb-3">
                    <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="job.requirements?.length == 0">
                        Ni zatevanega znanja
                    </li>
                    <li v-on:click='remove_requirement(req)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="req in job.requirements" :key="req">
                        {{ req }}
                        <span class='material-symbols-outlined text-color-gray float-right'>delete</span>
                    </li>
                </ul>
                <div class="w-full md:w-[85%] lg:w-[70%] align-middle border rounded-lg border-color-gray placeholder-color-gray grid grid-cols-8">
                    <input id='new_requirement' v-model='new_requirement' class='col-span-7 px-4 py-2 placeholder-color-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-color-turquoise' :placeholder='"Dodaj zahtevano znanje"' type='text'>
                    <button type="submit" class="hidden md:block text-color-gray hover:text-color-turquoise rounded-lg text-2xl">+</button>
                </div>
                <br>
            </form>
            

            <form @submit.prevent='add_responsibility'>
                <div class='text-color-gray mb-1'>Naloge in odgovornosti</div>
                <ul class="mb-3">
                    <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="job.responsibilities?.length == 0">
                        Ni nalog in odgovornosti
                    </li>
                    <li v-on:click='remove_responsibility(res)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="res in job.responsibilities" :key="res">
                        {{ res }}
                        <span class='material-symbols-outlined text-color-gray float-right'>delete</span>
                    </li>
                </ul>
                <div class="w-full md:w-[85%] lg:w-[70%] align-middle border rounded-lg border-color-gray placeholder-color-gray grid grid-cols-8">
                    <input id='new_responsibility' v-model='new_responsibility' class='col-span-7 px-4 py-2 placeholder-color-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-color-turquoise' :placeholder='"Dodaj nalogo ali odgovornost"' type='text'>
                    <button type="submit" class="hidden md:block text-color-gray over:text-color-turquoise rounded-lg text-2xl">+</button>
                </div>
                <br>
            </form>
                
            <form @submit.prevent='add_offer' class="mb-4">
                <div class='text-color-gray mb-1'>Ponujamo</div>
                <ul class="mb-3">
                    <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="job.offers?.length == 0">
                        Ponudba ne obstaja
                    </li>
                    <li v-on:click='remove_offer(offer)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="offer in job.offers" :key="offer">
                        {{ offer }}
                        <span class='material-symbols-outlined text-color-gray float-right'>delete</span>
                    </li>
                </ul>
                <div class="w-full md:w-[85%] lg:w-[70%] align-middle border rounded-lg border-color-gray placeholder-color-gray grid grid-cols-8">
                    <input id='new_offer' v-model='new_offer' class='col-span-7 px-4 py-2 placeholder-color-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-color-turquoise' :placeholder='"Dodaj ponudbo"' type='text'>
                    <button type="submit" class="hidden md:block text-color-gray hover:text-color-turquoise rounded-lg text-2xl">+</button>
                </div>
                <br>
            </form>

            <Benjamin class="mr-5" v-on:click="updateJob">Spremeni oglas</Benjamin>
            <BenjaminRedInverted v-on:click="removeJob">Izbriši oglas</BenjaminRedInverted>
        </div>
    </div>
 </template>

<style>

[type='checkbox'] {
    display: none;
}

[type='checkbox'] + label {
    position: relative;
    padding-left: 30px;
    display: inline-block;
    line-height: 16px;
}

[type='checkbox'] + label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    border: 1px solid #CECECE;
    border-radius: 3px;
}

[type='checkbox']:checked + label::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    border: 1px solid #CECECE;
    border-radius: 3px;
    background-color: #CECECE;
}

[type='checkbox']:checked + label {
    color: #CECECE;
    text-decoration: line-through;
}
</style>

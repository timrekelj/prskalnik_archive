<script lang='ts' setup>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { toast } from 'vue-sonner'
import { type Job } from '~/types/job'
import { type Database } from '~/types/supabase'
import Fuse from 'fuse.js'

definePageMeta({
    middleware: ['not-logged-in', 'is-user']
})
</script>

<script lang='ts'>
export default {
    components: {
        vSelect,
    },
    data: () => ({
        new_job: <Job><unknown>{
            country: "Slovenija",
            reward: true,
            offers: [],
            requirements: [],
            responsibilities: []
        },
        picked: 'yes',
        regions: [] as {region: string | null}[],
        supabase: {} as Database,

        new_requirement: "",
        new_responsibility: "",
        new_offer: "",
    }),
    async mounted() {
        const id: string | null = localStorage.getItem('selectedAd')
        const supabase = useSupabaseClient<Database>()
        const user = useSupabaseUser().value

        if (!id || !supabase || !user) return
            
        this.regions = (await supabase.from('regions').select('*')).data ?? []
        this.new_job.company_id = user.id
        this.new_job.region = this.regions[0].region ?? ""

    },
    methods: {
        fuseSearch(options: any[], search: string) {
            const fuse = new Fuse(options, {
                keys: ['region'],
            })
            return fuse.search(search).map(({ item }) => item)
        },
        async insertSupabaseJob(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()
                const { data, error } = await supabase.from('jobs').insert([this.new_job]).select()

                if (error) resolveErr(error)
                else resolveSucc(data.toString())
            })
        },
        insertJob() {
            if (!this.new_job.title || !this.new_job.profession || !this.new_job.location || !this.new_job.description) {
                toast.error("Prosimo, da izpolnite vsa polja.")
                return
            }

            toast.promise(this.insertSupabaseJob, {
                loading: 'Dodajanje oglasa...',
                success: (data: any) => {
                    navigateTo('/', { replace: true });
                    return 'Oglas uspešno dodan'
                },
                error: (data: any) => {
                    return 'Prišlo je do napake pri dodajanju oglasa'
                }
            })
        },
        changeRadio(chosen: string) {
            if (chosen == "yes") {
                this.new_job.reward = true
                this.picked = "yes"
            } else {
                this.new_job.reward = false
                this.picked = "no"
            }
        },
        remove_requirement(requirement: string) {
           this.new_job.requirements = this.new_job.requirements!.filter(item => item != requirement) 
        },
        add_requirement() {
           if (this.new_requirement == "") return
           this.new_job.requirements!.push(this.new_requirement)
           this.new_requirement = ""
        },
        remove_responsibility(responsibility: string) {
           this.new_job.responsibilities = this.new_job.responsibilities!.filter(item => item != responsibility) 
        },
        add_responsibility() {
           if (this.new_responsibility == "") return
           this.new_job.responsibilities!.push(this.new_responsibility)
           this.new_responsibility = ""
        },
        remove_offer(offer: string) {
           this.new_job.offers = this.new_job.offers!.filter(item => item != offer) 
        },
        add_offer() {
           if (this.new_offer == "") return
           this.new_job.offers!.push(this.new_offer)
           this.new_offer = ""
        }
    }
}
</script>

<template>
    <div>
        <Richard>Dodaj nov oglas</Richard>
        <div class='grid-for-couples'>
            <div class='grid-breakup'>
                <Richard>Pozdravljen uporabnik/ca!</Richard>
                <div class='md:w-[80%] sm:mb-10'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </div>
            </div>
            <div>
                <div class="text-color-gray">Delovno mesto</div>
                <input id='title' v-model='new_job.title' class='text-field-split' :placeholder='"Delovno mesto"' type='text'/>
                <br>
                
                <div class="text-color-gray">Smer izobraževanja</div>
                <input id='profession' v-model='new_job.profession' class='text-field-split' :placeholder='"Smer izobraževanja"' type='text'/>
                <br>

                <div class="text-color-gray">Lokacija dela</div>
                <input id='location' v-model='new_job.location' class='text-field-split' :placeholder='"Lokacija dela"' type='text'/>
                <br>

                <div class='text-color-gray'>Regija</div>
                <v-select :filter="fuseSearch" v-model="new_job.region" class="dropdown-select" label="region" :reduce="region => region.region" :options='regions'></v-select>
                <br>
                
                <div class='text-color-gray mb-1'>Nagrada</div>
                <div class='mb-1' v-on:click='changeRadio("yes")'>
                    <input v-model="picked"
                           :class='new_job.reward ? "bg-color-black" : "bg-color-gray"'
                           class='appearance-none rounded-full h-3 w-3' type="radio"
                           value="yes">
                    <label :class="new_job.reward ? 'text-color-black' : 'text-color-gray'" class='ml-2' for="yes">Nagrada je prisotna</label>
                    <br>
                </div>

                <div class='mb-3' v-on:click='changeRadio("no")'>
                    <input v-model="picked"
                           :class='new_job.reward ? "bg-color-gray" : "bg-color-black"'
                           class='appearance-none rounded-full h-3 w-3' type="radio"
                           value="no">
                    <label :class="new_job.reward ? 'text-color-gray' : 'text-color-black'" class='ml-2' for="no">Nagrada ni prisotna</label>
                    <br>
                </div>

                <div class='text-color-gray mb-1'>Opis dela</div>
                <textarea v-model='new_job.description as string' class='text-field-split'></textarea>
                <br>

                <form @submit.prevent='add_requirement'>
                    <div class='text-color-gray mb-1'>Zahtevano znanje</div>
                    <ul class="mb-3">
                        <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="new_job.requirements!.length == 0">
                            Ni zatevanega znanja
                        </li>
                        <li v-on:click='remove_requirement(req)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="req in new_job.requirements" :key="req">
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
                        <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="new_job.responsibilities!.length == 0">
                            Ni nalog in odgovornosti
                        </li>
                        <li v-on:click='remove_responsibility(res)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="res in new_job.responsibilities" :key="res">
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
                        <li class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-if="new_job.offers!.length == 0">
                            Ponudba ne obstaja
                        </li>
                        <li v-on:click='remove_offer(offer)' class="mt-1 bg-color-lightgray w-full md:w-[85%] lg:w-[70%] rounded-lg p-2" v-for="offer in new_job.offers" :key="offer">
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

                <Benjamin v-on:click="insertJob">
                    Dodaj oglas
                </Benjamin>
            </div>
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


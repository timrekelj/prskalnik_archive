<script lang='ts' setup>
import { toast } from 'vue-sonner'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { type Database } from '~/types/supabase'
import Fuse from 'fuse.js'
</script>

<script lang='ts'>
export default {
    data: () => ({
        emptyField: false,

        firstname: '',
        lastname: '',
        yearofbirth: '',
        eduinstitution: '',
        eduprogram: '',

        institutions: [] as string[],
        programs: [] as string[][],

        picked: 'high',
        collegePicked: false,

        chosenFile: null
    }),
    async mounted() {
        const json = await import('~/assets/fakultete.json');
        this.institutions = Object.keys(json.default);
        this.programs = Object.values(json.default);
    },
    methods: {
        fuseSearch(options: any[], search: string) {
            const fuse = new Fuse(options, {
                shouldSort: true,
            })
            return fuse.search(search).map((result) => result.item)
        },
        readFile(event: any) {
            if (event.target.files[0].size > 2*1024*1024) {
                toast.error("Datoteka je prevelika. Največja dovoljena velikost je 2MB.")
                return
            }
            this.chosenFile = event.target.files[0];
        },
        changeRadio(chosen: string) {
            if (chosen == "college") {
                this.collegePicked = true
                this.picked = "college"
            } else {
                this.collegePicked = false
                this.picked = "high"
            }
        },
        async insertSupabaseUser(): Promise<string> {
            return new Promise( async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>();
                
                // register the user
                const { token_hash, type } = Object.fromEntries(new URLSearchParams(window.location.search))
                const { data: { session }, error: verify_error } = await supabase.auth.verifyOtp({ token_hash, type })

                if (verify_error) resolveErr(verify_error)

                const { data: insert_data, error: insert_error } = await supabase.from('users').insert(
                    {
                        id: session?.user.id,
                        firstname: this.firstname,
                        lastname: this.lastname,
                        email: session?.user.email,
                        birthyear: this.yearofbirth,
                        college: this.collegePicked,
                        eduinstitution: this.eduinstitution,
                        eduprogram: this.eduprogram
                    }
                )
                if (verify_error) resolveErr(verify_error)

                const cv_name = `${this.firstname}-${this.lastname}.pdf`
                const { data: cv_data, error: cv_error } = await supabase.storage.from('users').upload(`/${session?.user.id}/${cv_name}`, this.chosenFile)
                if (cv_error) resolveErr(cv_error)

                resolveSucc("yay")
            })
        },
        async submitForm() {
            if (this.firstname === '' || this.lastname === '' || this.yearofbirth === '' || this.eduinstitution === '' || this.eduprogram === '' || this.chosenFile == null) {
                toast.error("Prosimo, da izpolnite vsa polja.")
                return
            }

            toast.promise(this.insertSupabaseUser, {
                loading: 'Shranjevanje podatkov...',
                success: (data: any) => {
                    navigateTo('/', { replace: true });
                    return 'Uporabnik uspešno registriran'
                },
                error: (data: any) => {
                    return 'Prišlo je do napake pri shranjevanju podatkov'
                }
            })
        }
    }
}
</script>

<template>
    <div class='grid-for-couples'>
        <div class='grid-breakup'>
            <Richard>Pozdravljen uporabnik/ca!</Richard>
            <div class='md:w-[80%] sm:mb-10'>
                Preden lahko v celoti začneš uporabljati Prskalnik te prosimo, da izpolniš še ta obrazec, saj ti bo
                tako lažje najti pravo priložnost.
            </div>
        </div>
        <div>
            <form @submit.prevent='submitForm'>
                <div class='text-color-gray'>Ime</div>
                <input id='firstname' v-model='firstname' class='text-field-split' placeholder='Janez' type='text'/><br>

                <div class='text-color-gray'>Priimek</div>
                <input id='lastname' v-model='lastname' class='text-field-split' placeholder='Novak' type='text'/><br>

                <div class='text-color-gray'>Leto rojstva</div>
                <input id='yearofbirth' v-model='yearofbirth' class='text-field-split' placeholder='2002' type='number'/><br>

                <div class='text-color-gray'>Stopnja izobraževanja</div>
                <div class='mb-1' v-on:click='changeRadio("high")'>
                    <input v-model="picked"
                            :class='collegePicked ? "bg-color-gray" : "bg-color-black"'
                            class='appearance-none rounded-full h-3 w-3' type="radio"
                            value="high">
                    <label :class="collegePicked ? 'text-color-gray' : 'text-color-black'" class='ml-2' for="yes">
                        Srednješolsko izobraževanje
                    </label>
                </div>

                <div class="mb-5" v-on:click='changeRadio("college")'>
                    <input v-model="picked"
                            :class='collegePicked ? "bg-color-black" : "bg-color-gray"'
                            class='appearance-none rounded-full h-3 w-3' type="radio"
                            value="college">
                    <label :class="collegePicked ? 'text-color-black' : 'text-color-gray'" class='ml-2' for="no">
                        Visoko oz. višješolsko izobraževanje
                    </label>
                </div>

                <div class='text-color-gray'>Vpiši ime izobraževalne ustanove, ki jo obiskuješ</div>
                <v-select :filter="fuseSearch" v-if="collegePicked" v-model="eduinstitution" class="dropdown-select leading-loose" label="institutions" :options='institutions'></v-select>
                <input v-if="!collegePicked" id='eduinstitution' v-model='eduinstitution' class='text-field-split' placeholder='Šolski center Kranj - Srednja tehniška šola' type='text'/><br>

                <div class='text-color-gray'>Vpiši ime programa, ki ga obiskuješ</div>
                <v-select :filter="fuseSearch" v-if="collegePicked" v-model="eduprogram" class="dropdown-select" label="programs" :options='programs[institutions.indexOf(eduinstitution)]'></v-select>
                <input v-if="!collegePicked" v-model='eduprogram' id='eduprogram' class='text-field-split' placeholder='Tehnik računalništva' type='text'/><br>

                <div class="text-color-gray mb-2">Naloži živjenjepis (.pdf)</div>
                <label class="border rounded-lg px-6 py-2 mb-5" for="cv">Izberi datoteko</label>
                <input id="cv" accept=".pdf" class="hidden" name="cv" type="file" @change="readFile"><br>

                <div v-if="chosenFile != null">
                    <div class="mt-3 text-color-gray text-sm">Trenutno izbrana datoteka:</div>
                    <div class="text-sm">{{ chosenFile.name }}</div>
                </div>

                <Benjamin :class="[(chosenFile || emptyField) ? 'mt-5' : 'mt-10']" >Zaključi</Benjamin>
            </form>
        </div>
    </div>
</template>

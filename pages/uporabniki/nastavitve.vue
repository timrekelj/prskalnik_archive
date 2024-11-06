<script lang='ts' setup>
import { toast } from 'vue-sonner'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { type Database } from '~/types/supabase'
import { type User } from '~/types/user'
import { type Company } from '~/types/company'
import Fuse from 'fuse.js'

definePageMeta({
    middleware: 'not-logged-in'
})
</script>

<script lang='ts'>
export default {
    data: () => ({
        email: "" as string | undefined,
        password: "",
        repeat_password: "",

        userData: <User>{}, 
        companyData: <Company>{},

        // User specific data
        lastname: "",
        firstname: "",
        birthyear: "",
        picked: 'high',
        collegePicked: false,
        eduinstitution: "",
        eduprogram: "",
        institutions: [] as string[],
        programs: [] as string[][],
        chosenFile: null as File | null,

        // Company specific data
        name: "",
        description: "",
        address: "",
        industry: "",
        firstname_contact_person: "",
        lastname_contact_person: "",
        phone_contact_person: "",
        email_contact_person: "",

        isCompany: false,
    }),
    async mounted() {
        // Get institutions and programs from json
        const json = await import('~/assets/fakultete.json');
        this.institutions = Object.keys(json.default);
        this.programs = Object.values(json.default);

        const user = useSupabaseUser()
        const supabase = useSupabaseClient<Database>()

        this.isCompany = (await supabase.from('companies').select().eq('id', user.value!.id)).data?.length == 1 ? true : false

        if (this.isCompany) {
            // Get company data from supabase and set it to data
            const { data } = await supabase.from('companies').select().eq('id', user.value!.id)
            if (data) this.companyData = data[0]

            this.name = this.companyData.name
            this.description = this.companyData.description
            this.address = this.companyData.address
            this.industry = this.companyData.industry
            this.firstname_contact_person = this.companyData.firstname_contact_person
            this.lastname_contact_person = this.companyData.lastname_contact_person
            this.phone_contact_person = this.companyData.phone_contact_person
            this.email_contact_person = this.companyData.email_contact_person
        } else {
            // Get user data from supabase and set it to data
            const { data } = await supabase.from('users').select().eq('id', user.value!.id)
            if (data) this.userData = data[0]

            this.email = this.userData.email!;
            this.firstname = this.userData.firstname;
            this.lastname = this.userData.lastname;
            this.birthyear = this.userData.birthyear;
            this.eduinstitution = this.userData.eduinstitution;
            this.eduprogram = this.userData.eduprogram;
        }
    },
    methods: {
        fuseSearch(options: any[], search: string) {
            const fuse = new Fuse(options, {
                shouldSort: true,
            })
            return fuse.search(search).map((result) => result.item)
        },
        readFile(event: any) {
            if (event.target.files[0].size > 2 * 1024 * 1024) {
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
        async changeSettings() {
            if (
                (this.isCompany && this.email_contact_person != this.companyData.email_contact_person) ||
                (!this.isCompany && this.email != this.userData.email)
            ) {
                toast.promise(this.changeSupabaseEmail, {
                    loading: 'Spreminjanje emaila...',
                    success: (data: any) => { return 'Na svoj email ste prejeli navodila za potrditev emaila' },
                    error: (err: any) => { return err.message }
                })
            }

            toast.promise(this.isCompany ? this.changeSupabaseCompany : this.changeSupabaseUser, {
                loading: 'Spreminjanje nastavitev...',
                success: (data: any) => { return 'Nastavitve so bile uspešno spremenjene' },
                error: (err: any) => { return err.message }
            })

            // reset fields
            this.chosenFile = null
        },
        async changePassword() {
            toast.promise(this.changeSupabasePassword,{
                loading: 'Spreminjanje gesla...',
                success: (data: any) => { return 'Na svoj email ste prejeli navodila za spremembo gesla' },
                error: (err: any) => { return err.message }
            })
        },
        async deleteUser() {
            toast.error('Potrdite izbris oglasa', {
                action: {
                    label: 'Izbriši',
                    onClick: () => {
                        toast.promise(this.removeSupabaseUser, {
                            loading: 'Brisanje oglasa...',
                            success: async (data: any) => {
                                const {auth} = useSupabaseClient<Database>();
                                const {error} = await auth.signOut();
                                navigateTo('/');
                                return 'Uporabnik je bil izbrisan'
                            },
                            error: (data: any) => 'Napaka pri brisanju uporabniškega računa',
                        })
                        
                    }
                },
            })
        },
        async removeSupabaseUser(): Promise<String> {
            return new Promise(async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()
                const user = useSupabaseUser()

                resolveSucc("yay")
            })
        },
        async changeSupabaseUser(): Promise<String> {
            return new Promise(async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()
                const user = useSupabaseUser()

                const { error: update_error } = await supabase.from("users").update({
                    email: this.email,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    birthyear: this.birthyear,
                    college: this.collegePicked,
                    eduinstitution: this.eduinstitution,
                    eduprogram: this.eduprogram,
                }).eq('id', user.value!.id)
                if (update_error) resolveErr(update_error.message)

                // Updating CV file
                if (this.chosenFile != null) {
                    const cv_name = `${this.firstname}-${this.lastname}.pdf`
                    const { error: cv_error } = await supabase.storage.from('users').update(`/${user.value!.id}/${cv_name}`, this.chosenFile)
                    if (cv_error) resolveErr(cv_error.message)
                }

                resolveSucc("yay")
            })
        },
        async changeSupabaseCompany(): Promise<String> {
            return new Promise(async (resolveSucc, resolveErr) => {
                const supabase = useSupabaseClient<Database>()
                const user = useSupabaseUser()

                const { error: update_error } = await supabase.from("companies").update({
                    name: this.name,
                    description: this.description,
                    address: this.address,
                    industry: this.industry,
                    firstname_contact_person: this.firstname_contact_person,
                    lastname_contact_person: this.lastname_contact_person,
                    phone_contact_person: this.phone_contact_person,
                    email_contact_person: this.email_contact_person,
                }).eq('id', user.value!.id)
                if (update_error) resolveErr(update_error.message)
                resolveSucc("yay")
            })
        },
        async changeSupabaseEmail(): Promise<string> {
            return new Promise(async (resolveSucc, resolveErr) => {
                console.log("balls")
                const { auth } = useSupabaseClient<Database>()
                const { error: update_error } = await auth.updateUser({ email: this.email })

                if (update_error) resolveErr(update_error.message)
                else resolveSucc("yay")
            })
        },
        async changeSupabasePassword(): Promise<string> {
            return new Promise(async (resolveSucc, resolveErr) => {
                const { auth } = useSupabaseClient<Database>()
                const user = useSupabaseUser()

                const { error: reset_error } = await auth.resetPasswordForEmail(user.value!.email!)

                if (reset_error) resolveErr(reset_error.message)
                else resolveSucc("yay")
            })
        },
    }
}
</script>

<template>
    <div>
        <div class="grid-for-couples">
            <div class="grid-breakup">
                <Richard>Pozdravljen uporabnik/ca!</Richard>
                <div class="md:w-[80%] sm:mb-10">
                    Lorem ipsum dolor amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </div>
            </div>
            <div>
                <Richard>Nastavitve</Richard>

                <div v-if="!isCompany">
                    <div class="text-color-gray">Elektronski naslov</div>
                    <input id="email" v-model="email" class="text-field-split" :placeholder="userData.email!" type="text"><br>

                    <div class="text-color-gray">Ime</div>
                    <input id="firstname" v-model="firstname" class="text-field-split" :placeholder="userData.firstname" type="text"><br>

                    <div class="text-color-gray">Priimek</div>
                    <input id="lastname" v-model="lastname" class="text-field-split" type="text"><br>

                    <div class="text-color-gray">Leto rojstva</div>
                    <input id="birthyear" v-model="birthyear" class="text-field-split" type="number"><br>

                    <div class="text-color-gray">Stopnja izobraževanja</div>
                    <div class="mb-1" @click="changeRadio('high')">
                        <input v-model="picked" :class="collegePicked ? 'bg-color-gray' : 'bg-color-black'"
                            class="appearance-none rounded-full h-3 w-3" type="radio" value="high">
                        <label :class="collegePicked ? 'text-color-gray' : 'text-color-black'" class="ml-2" for="yes">Srednješolsko izobraževanje</label><br>
                    </div>

                    <div class="mb-3" @click="changeRadio('college')">
                        <input v-model="picked" :class="collegePicked ? 'bg-color-black' : 'bg-color-gray'"
                            class="appearance-none rounded-full h-3 w-3" type="radio" value="college">
                        <label :class="collegePicked ? 'text-color-black' : 'text-color-gray'" class="ml-2" for="no">Visoko oz. višješolsko izobraževanje</label>
                    </div>

                    <div class="text-color-gray">Vpiši ime izobraževalne ustanove, ki jo obiskuješ</div>
                    <v-select :filter="fuseSearch" v-model="eduinstitution" class="dropdown-select  mb-3" label="institutions"
                        :options="institutions"/>

                    <div class="text-color-gray">Vpiši ime programa, ki ga obiskuješ</div>
                    <v-select :filter="fuseSearch" v-model="eduprogram" class="dropdown-select mb-3" label="programs" :options="programs[institutions.indexOf(eduinstitution)]" />

                    <div class="text-color-gray mb-3">
                        Naloži živjenjepis (.pdf)
                    </div>
                    <label class="border rounded-lg px-6 py-2" for="cv">Izberi datoteko</label>
                    <input id="cv" accept=".pdf" class="hidden" name="cv" type="file" @change="readFile"><br>

                    <div v-if="chosenFile != null">
                        <div class="mt-3 text-color-gray text-sm">Trenutno izbrana datoteka:</div>
                        <div class="text-sm">{{ chosenFile.name }}</div>
                    </div>
                </div>

                <div v-if="isCompany">
                    <div class="text-color-gray">Ime podjetja</div>
                    <input id="name" v-model="name" class="text-field-split" :placeholder="name" type="text"><br>

                    <div class="text-color-gray">Industrija v kateri podjetje deluje</div>
                    <input id="industry" v-model="industry" class="text-field-split" :placeholder="industry" type="text"><br>

                    <div class="text-color-gray">Opis podjetja</div>
                    <textarea id="description" v-model="description" class="text-field-split" :placeholder="description" type="text"/><br>

                    <div class="text-color-gray">Naslov podjetja</div>
                    <input id="address" v-model="address" class="text-field-split" :placeholder="address" type="text"><br>

                    <div class="text-color-gray">Ime kontaktne osebe</div>
                    <input id="firstname_contact_person" v-model="firstname_contact_person" class="text-field-split" :placeholder="firstname_contact_person" type="text"><br>

                    <div class="text-color-gray">Priimek kontaktne osebe</div>
                    <input id="lastname_contact_person" v-model="lastname_contact_person" class="text-field-split" :placeholder="lastname_contact_person" type="text"><br>

                    <div class="text-color-gray">Elektronski naslov kontaktne osebe</div>
                    <input id="email_contact_person" v-model="email_contact_person" class="text-field-split" :placeholder="email_contact_person" type="text"><br>

                    <div class="text-color-gray">Telefon kontaktne osebe</div>
                    <input id="phone_contact_person" v-model="phone_contact_person" class="text-field-split" :placeholder="phone_contact_person" type="text"><br>
                </div>

                <Benjamin v-on:click="changeSettings" :class="[chosenFile ? 'mt-3' : 'mt-6']">Shrani nastavitve</Benjamin>
                <BenjaminInverted v-on:click="changePassword" class="mt-3 lg:ml-3 lg:mt-0">Spremeni geslo</BenjaminInverted>
                <br>
                <BenjaminRedInverted v-on:click="deleteUser" class="mt-3">Izbriši svoj profil</BenjaminRedInverted>
                <br>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { type Database } from '~/types/supabase'
import { type Job } from '~/types/job'
import { type Company } from '~/types/company'

definePageMeta({
    middleware: ['not-logged-in', 'is-company']
})
</script>

<script lang='ts'>
export default {
    data() {
        return {
            job: <Job>{},
            company: <Company>{},
            allChecked: false,
            noRequirements: false,
            noOffers: false,
            noResponsibilities: false,
            alreadyApp: false
        }
    },
    async mounted() {
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();

        // get job id from url 
        const { id } = Object.fromEntries(new URLSearchParams(window.location.search))

        const jobData = (await supabase.from('jobs').select('*').eq('id', id)).data
        if (!jobData) navigateTo('/iskanje');
        this.job = jobData[0];

        if (this.job.requirements.length === 0) this.noRequirements = true
        if (this.job.offers.length === 0) this.noOffers = true
        if (this.job.responsibilities.length === 0) this.noResponsibilities = true

        const companyData = (await supabase.from('companies').select('*').eq('id', this.job.company_id)).data
        if (!companyData) return;
        this.company = companyData[0];

        this.allChecked = this.job.requirements === null
        this.alreadyApp = (await supabase.from('user_job').select().eq('user_id', user.value!.id).eq('job_id', id)).data?.length == 1;
    },
    methods: {
        checkReq() {
            var checkboxes = document.forms.req.elements;

            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].checked) {
                    this.allChecked = false;
                    return;
                }
            }
            this.allChecked = true
        },
        async apply() {
            const id = localStorage.getItem('selectedAd')
            const supabase = useSupabaseClient<Database>()
            const user = useSupabaseUser()
            const { error } = await supabase.from('user_job').insert({ 'user_id': user.value?.id, 'job_id': id })
            if (error) return
            this.alreadyApp = true
        }
    }
}
</script>

<template>
    <div class="select-text">
        <!-- title, profession, location, region, country, reward, responsibilities, requirements, offers, description -->
        <Richard>Podrobnosti o oglasu: <span class="text-color-turquoise">{{ job.title }}</span></Richard>

        <div class="mb-5">
            <div class="font-bold text-lg mb-1">Podrobnosti o delovnem mestu</div>
            <div><span class="font-bold">Poklic:</span> {{ job.profession }}</div>
            <div><span class="font-bold">Kraj:</span> {{ job.location }}</div>
            <div><span class="font-bold">Regija:</span> {{ job.region }}</div>
            <div><span class="font-bold">Država:</span> {{ job.country }}</div>
            <div><span class="font-bold">Nagrada:</span> {{ job.reward ? "da" : "ne" }}</div>
        </div>

        <div class="font-bold text-lg">Opis delovnega mesta</div>
        <div class="mb-5">{{ job.description }}</div>

        <div class="mb-5" v-if='!noResponsibilities'>
            <div class="font-bold mb-1 text-lg">Naloge in odgovornosti</div>
            <ul>
                <li class="list-disc ml-5" v-for="(r, index) in job.responsibilities" :key='index'>{{ r }}</li>
            </ul>
        </div>
        <div class="mb-5" v-if='!noRequirements'>
            <div class="font-bold mb-1 text-lg">Zahtevana znanja <span class="text-color-gray font-normal">(označi vsa znanja za nadaljevanje)</span></div>
            <form id='req'>
                <div v-for="(r, index) in job.requirements" class="mb-2" @change='checkReq'>
                    <input :id='index' name='a' type='checkbox' />
                    <label :for='index.toString()'>{{ r }}</label>
                </div>
            </form>
        </div>
        <div class="mb-5" v-if='!noOffers'>
            <div class="font-bold mb-1 text-lg">Ponujamo</div>
            <ul>
                <li class="list-disc ml-5" v-for="(r, index) in job.offers" :key='index'>{{ r }}</li>
            </ul>
        </div>

        <BenjaminInverted v-if='(allChecked && !alreadyApp) || noRequirements' @click="apply" class="mb-5">
            Prijava na prosto mesto
        </BenjaminInverted>
        <div v-else-if="alreadyApp && allChecked" class="text-lg mb-5 text-red-400">Si se ze prijavil</div>

        <div class="font-bold mb-2 text-2xl">Kdo zaposluje?</div>
        <div class="mb-1">{{ company.name }}</div>
        <div class="mb-5">{{ company.description }}</div>
        <div class="font-bold text-lg mhttp://localhost:3000/oglas?id=8d1a5f02-4eaf-49d8-b540-2175612c7926b-1">Kontakt</div>
        <div class='space-y-2 mb-8'>
            <div class="space-x-6">
                <span class='material-symbols-outlined float-left select-none'>location_on</span>
                <a>{{ company.address }}</a>
            </div>
            <div class="space-x-6">
                <span class='material-symbols-outlined float-left select-none'>alternate_email</span>
                <a :href="'mailto:' + company.email_contact_person">{{ company.email_contact_person }}</a>
            </div>
            <div class="space-x-6">
                <span class='material-symbols-outlined float-left select-none'>call</span>
                <a :href="'tel:' + company.phone_contact_person">{{ company.phone_contact_person }}</a>
            </div>
        </div>
    </div>
</template>

<style>
[type='checkbox'] {
    display: none;
}

[type='checkbox']+label {
    position: relative;
    padding-left: 30px;
    display: inline-block;
    line-height: 16px;
}

[type='checkbox']+label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    border: 1px solid #CECECE;
    border-radius: 3px;
}

[type='checkbox']:checked+label::after {
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

[type='checkbox']:checked+label {
    color: #CECECE;
    text-decoration: line-through;
}
</style>

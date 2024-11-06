import { toast } from 'vue-sonner'
export default defineNuxtPlugin(() => {
    // do not register the 'Toaster' component here
    return { provide: { toast } }
})

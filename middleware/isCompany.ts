import { type Database } from "~/types/supabase";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser();
    const db = useSupabaseClient<Database>();

    if (user.value) {
        var isCompany = (await db.from('companies').select().eq('id', user.value.id)).data?.length !== 0; 
        if (isCompany) {
            return navigateTo('/nadzornaplosca');
        }
    }
});

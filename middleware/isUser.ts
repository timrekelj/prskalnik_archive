import { type Database } from "~/types/supabase";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser();
    const db = useSupabaseClient<Database>();

    if (user.value) {
        var isUser = (await db.from('users').select().eq('id', user.value.id)).data?.length !== 0
        if (isUser) {
            return navigateTo('/iskanje');
        }
    }
});

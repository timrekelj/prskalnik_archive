export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();
    if (user.value == undefined) {
        return navigateTo('/');
    }
})

export default defineEventHandler((event) => {
    if (process.client) {
        window._AutofillCallbackHandler = window._AutofillCallbackHandler || function() {}
    }
});

export default defineEventHandler((event) => {
    setHeader(event, 'Cache-Control', 'public, must-revalidate, max-age=0, s-maxage=3600');
});

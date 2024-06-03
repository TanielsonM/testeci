export default defineEventHandler((event) => {
  console.log('teste', event.context.params.product_id)
});
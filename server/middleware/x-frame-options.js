// Define o manipulador de eventos para configurar cabeçalhos HTTP na resposta.
// Este código adiciona o cabeçalho `X-Frame-Options` à resposta HTTP.
// O valor `DENY` impede que a página seja exibida em um `<iframe>` em outro domínio,
// aumentando a segurança ao evitar ataques de clickjacking.
export default defineEventHandler((event) => {
    setHeader(event, 'X-Frame-Options', 'DENY');
});

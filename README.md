# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Como Executar os Testes Automatizados

1. Instalar o playwright

```bash
npx playwright install
```
Ou

```bash
yarn playwright install
```

2. Executando todos os testes

```bash
npx playwright test
```

3. Executando um teste específico

```bash
npx playwright test path/para/seu/teste.spec.ts
```

# Como Executar o Projeto Localmente em Docker

Este guia irá ajudá-lo a executar o projeto localmente usando o Docker Compose.

## Pré-requisitos

- Docker instalado: [Guia de instalação do Docker](https://docs.docker.com/get-docker/)
- Docker Compose instalado: [Guia de instalação do Docker Compose](https://docs.docker.com/compose/install/)

## Passos para Execução

1. Certifique-se de que o arquivo `.env-development` está presente na raiz do projeto com as variáveis de ambiente necessárias.

2. Execute o comando `docker-compose` para construir e iniciar os contêineres:

  ```sh
  docker-compose -f local.docker-compose.yaml up --build
   ```
- Acesse a aplicação em seu navegador em http://localhost:81.

## Comandos Úteis:
1. Verificar os contêineres em execução:

  ```sh
 docker ps
   ```

2. Visualizar logs dos contêineres:
 
  ```sh
 docker-compose -f local.docker-compose.yaml logs
  ``` 
## Parar execução do container:

   ```sh
  docker-compose -f local.docker-compose.yaml down -
   ```







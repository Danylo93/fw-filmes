
## Tecnologias

* Next.js
* TypeScript
* NextAuth
* next-seo
* Tailwind CSS
* swr
* Login Social

## Demo

A [live deployment ('https://fw-filmes-j8g1wxre5-agencia-fw-digital.vercel.app/movies')](https://fw-filmes-j8g1wxre5-agencia-fw-digital.vercel.app/movies) of this app is available to try it out.
 

## Instalação

Clone e instale as dependências de `fw-filmes` localmente:

```bash 
git clone https://github.com/danylo93/fw-filmes
cd fw-filmes
yarn install
```

## Setup

1. Copie .env.local.example e renomeie para .env
2. Vá para o site do TMDB e gere uma API key e coloque as informações no .env
3. Coloque as informações do seu Postgres ou utilize o que deixei no .env.example
4. Coloque as credenciais do seu GOOGLE_ID e GOOGLE_SECRET para autenticação via Login Social
5. Gere um token JWT 
    
## Running locally

* `yarn dev`: rodar em ambiente de desenvolvimento
* `yarn build`: build do projeto
* `yarn start`: projeto em prod

## Docker

* `docker-compose up -d`: Para Rodar o projeto com Docker

    
## License

[MIT](https://choosealicense.com/licenses/mit/)

# Use uma imagem base do Node.js
FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Exponha a porta 3000 (a porta em que o Next.js geralmente roda)
EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["npm", "run", "dev"]
